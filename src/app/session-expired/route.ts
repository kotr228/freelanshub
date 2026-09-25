import { NextResponse, type NextRequest } from "next/server";
import { destroySession } from "@/lib/session";

// Server Components cannot modify cookies, so a stale session (e.g. the account
// was deleted) is cleared here before sending the user to the login page.
export async function GET(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/login", request.url));
}
