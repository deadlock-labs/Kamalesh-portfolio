import { NextResponse } from 'next/server';
import { skills } from '@/lib/data';

export async function GET() {
  return NextResponse.json(skills);
}
