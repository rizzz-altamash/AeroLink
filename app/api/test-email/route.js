// app/api/test-email/route.js
import { testEmailConfiguration } from '@/lib/email';

export async function GET() {
  const result = await testEmailConfiguration();
  return Response.json(result);
}