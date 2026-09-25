import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { removeStored } from "@/lib/storage";

const DAY = 86_400_000;

/**
 * Daily housekeeping:
 *  - open jobs whose deadline passed more than 30 days ago are removed;
 *  - finished jobs (paid/archived) older than a year are removed with all their files,
 *    as promised in the privacy policy. Payment records stay (their jobId becomes NULL).
 * Call with: curl -H "Authorization: Bearer $CRON_SECRET" https://host/api/cron/cleanup
 * (on Vercel, add it to vercel.json "crons" — Vercel sends the same header).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const stale = await prisma.job.findMany({
    where: {
      OR: [
        { status: "OPEN", deadline: { lt: new Date(now - 30 * DAY) } },
        { status: { in: ["PAID", "ARCHIVED"] }, createdAt: { lt: new Date(now - 365 * DAY) } },
      ],
    },
    select: { id: true },
  });
  const ids = stale.map((job) => job.id);

  if (ids.length > 0) {
    const files = await prisma.attachment.findMany({ where: { jobId: { in: ids } }, select: { filePath: true } });
    // Messages, attachments, reviews and notifications go with the job (ON DELETE CASCADE).
    await prisma.job.deleteMany({ where: { id: { in: ids } } });
    await Promise.all(files.map((file) => removeStored(file.filePath)));
  }

  await prisma.cleanup.upsert({
    where: { id: 1 },
    create: { id: 1, lastCleanupAt: new Date() },
    update: { lastCleanupAt: new Date() },
  });

  return NextResponse.json({ removedJobs: ids.length });
}
