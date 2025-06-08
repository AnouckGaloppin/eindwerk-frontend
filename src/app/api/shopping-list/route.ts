import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000'; // Update this to match your backend URL

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/shopping-list`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch shopping list' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/shopping-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to add item to shopping list' },
      { status: 500 }
    );
  }
} 