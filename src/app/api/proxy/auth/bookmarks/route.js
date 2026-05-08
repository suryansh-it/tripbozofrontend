// src/app/api/proxy/auth/bookmarks/route.js

import { headers } from 'next/headers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const incomingHeaders = await headers();
  const authHeader = incomingHeaders.get('authorization') || incomingHeaders.get('x-auth-token') || '';

  const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/bookmarks/`;
  const url = type ? `${backendUrl}?type=${type}` : backendUrl;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch bookmarks' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Bookmarks Proxy] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
