/**
 * @amber-capability tempo.api
 */

import { NextResponse } from "next/server";

/**
 * Lightweight health endpoint — useful when wrapping Tempo in a PWA shell
 * or smoke-testing the build. Returns the current data-format version so
 * future clients can negotiate import shape.
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    ok: true,
    app: "tempo",
    version: 1,
    runtime: "client-local",
  });
}
