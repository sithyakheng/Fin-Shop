export async function GET() {
  return new Response(JSON.stringify({ error: 'Use /api/auth for NextAuth v4 pages API' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  })
}
export const POST = GET
