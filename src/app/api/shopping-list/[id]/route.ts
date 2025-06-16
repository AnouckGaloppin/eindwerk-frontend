import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:63167'; // Backend URL

type RouteContext = {
  params: { id: string };
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const response = await fetch(`${BACKEND_URL}/api/shopping-list/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update shopping list item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
  try {
    const authHeader = request.headers.get('authorization');
    console.log('Attempting to delete item with ID:', params.id);
    
    const response = await fetch(`${BACKEND_URL}/api/shopping-list/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend delete error:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to delete shopping list item' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in DELETE route:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete shopping list item', 
        error: error instanceof Error ? error.message : 'Unknown error',
        id: params.id
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
  // Rest of your GET handler code
  return NextResponse.json({ message: 'Success' });
} 