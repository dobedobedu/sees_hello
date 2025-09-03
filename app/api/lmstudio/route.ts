import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'models';
  const baseUrl = searchParams.get('baseUrl') || 'http://localhost:1234/v1';

  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`LMStudio returned status ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('LMStudio API error:', error);
    const errorMessage = error.message.includes('fetch failed') 
      ? 'Cannot connect to LMStudio. Please ensure LMStudio is running on port 1234.'
      : error.message;
      
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: error.message
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
      signal: AbortSignal.timeout(30000) // 30 second timeout for completions
    });

    if (!response.ok) {
      throw new Error(`LMStudio returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('LMStudio API error:', error);
    const errorMessage = error.message.includes('fetch failed') 
      ? 'Cannot connect to LMStudio. Please ensure LMStudio is running on port 1234.'
      : error.message;
      
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: error.message
    }, { status: 500 });
  }
}