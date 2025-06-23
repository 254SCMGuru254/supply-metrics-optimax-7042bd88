import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

function monteCarloPi(iterations: number): number {
  let insideCircle = 0;
  for (let i = 0; i < iterations; i++) {
    const x = Math.random();
    const y = Math.random();
    if (x * x + y * y <= 1) {
      insideCircle++;
    }
  }
  return (4 * insideCircle) / iterations;
}

serve(async (req) => {
  const url = new URL(req.url);
  const iterations = Number(url.searchParams.get("iterations")) || 100000;
  const piEstimate = monteCarloPi(iterations);

  return new Response(
    JSON.stringify({ pi: piEstimate, iterations }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});