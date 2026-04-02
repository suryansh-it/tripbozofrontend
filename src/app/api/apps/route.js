// app/api/apps/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');

  const apps = {
    IT: [{ name: 'App Italia', url: 'https://example.com/it' }],
    US: [{ name: 'App USA', url: 'https://example.com/us' }],
  };

  return NextResponse.json(apps[country] || []);
}
