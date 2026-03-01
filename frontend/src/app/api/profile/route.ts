import { NextResponse } from 'next/server';
import { profile } from '@/lib/data';

export async function GET() {
  return NextResponse.json(profile);
}
