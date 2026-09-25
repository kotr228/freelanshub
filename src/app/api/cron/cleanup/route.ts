import { NextResponse, type NextRequest } from "next/server";
import { execute, query } from "@/lib/db";
import { removeStored } from "@/lib/storage";

/**
 * Daily housekeeping (was run on every visit of index.php before):
 *  - free orders whose deadline passed more than 30 days ago are removed;
 *  - finished orders (paid/archived) older than a year are removed with all their files,
 *    as promised in the privacy policy.
 * Call with: curl -H "Authorization: Bearer $CRON_SECRET" https://host/api/cron/cleanup
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stale = await query<{ id: number }>(
    `SELECT id_j AS id FROM job
      WHERE (status = 'S1' AND id_f IS NULL AND date < NOW() - INTERVAL 30 DAY)
         OR (status IN ('S3', 'S4') AND COALESCE(created_at, date) < NOW() - INTERVAL 365 DAY)`,
  );
  const ids = stale.map((row) => row.id);

  if (ids.length > 0) {
    const marks = ids.map(() => "?").join(",");
    const files = await query<{ path: string }>(
      `SELECT file_path AS path FROM files WHERE id_j IN (${marks})
       UNION ALL
       SELECT cf.file_path FROM chat_files cf JOIN chat ch ON ch.id_chat = cf.id_chat WHERE ch.id_j IN (${marks})`,
      [...ids, ...ids],
    );
    await Promise.all(files.map((file) => removeStored(file.path)));
    // Payment records keep their history; they just lose the link to the deleted order.
    await execute(`UPDATE \`otrimani kohti\` SET id_j = NULL WHERE id_j IN (${marks})`, ids);
    await execute(`DELETE FROM notifications WHERE id_j IN (${marks})`, ids);
    await execute(`DELETE FROM job WHERE id_j IN (${marks})`, ids);
  }
  await execute("UPDATE cleanup SET last_cleanup = CURDATE()");

  return NextResponse.json({ removedOrders: ids.length });
}
