import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');

  if (!sessionCookie?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    );

    // Check if session has expired
    if (Date.now() > sessionData.exp) {
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.delete('admin_session');
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: sessionData.email,
        name: sessionData.name,
        picture: sessionData.picture,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
