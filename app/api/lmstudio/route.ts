import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'models';
  const baseUrl = searchParams.get('baseUrl') || 'http://localhost:1234/v1';

  try {
    const response = await fetch(`${baseUrl}/${endpoint}`);
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to LMStudio' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'chat/completions';
  const baseUrl = searchParams.get('baseUrl') || 'http://localhost:1234/v1';

  try {
    const body = await request.json();
    
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to LMStudio' 
    }, { status: 500 });
  }
}