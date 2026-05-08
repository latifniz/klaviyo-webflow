import { NextRequest } from 'next/server';

/**
 * Type for Next.js route handlers that have dynamic route parameters
 */
export type RouteHandler<Params = Record<string, string>> = (
  request: NextRequest,
  context: { params: Params }
) => Promise<Response> | Response; 