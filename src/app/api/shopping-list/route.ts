import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:63167'; // Update this to match your backend URL

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const response = await fetch(`${BACKEND_URL}/api/shopping-list`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      }
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { message: 'Failed to fetch shopping list' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const response = await fetch(`${BACKEND_URL}/api/shopping-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
    return NextResponse.json(
      { message: 'Failed to add item to shopping list' },
      { status: 500 }
    );
  }
} 
}