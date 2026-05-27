/**
 * @amber-capability tempo.api
 * @amber-doc Static health-check endpoint at GET /api/health that returns the current data-format version, enabling PWA shells and CI smoke-test pipelines to verify a build is live and serving the expected schema version.
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
