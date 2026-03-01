import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_EMAIL = 'kkamalesh117@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
    }

    // Verify the Google ID token by calling Google's tokeninfo endpoint
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const payload = await verifyRes.json();

    // Verify email matches the allowed email
    if (payload.email !== ALLOWED_EMAIL || payload.email_verified !== 'true') {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 });
    }

    // Create a simple session token (base64-encoded JSON with expiry)
    const sessionData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    });

    // Set HTTP-only cookie for session
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
