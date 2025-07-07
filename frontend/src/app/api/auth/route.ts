// Example structure for a Next.js API route
export async function GET() {
  return Response.json({ message: 'Hello from API' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ message: 'POST request received', data: body });
}
