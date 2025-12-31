import { NextResponse } from 'next/server';

/**
 * Next.js API route to proxy images from backend
 * This avoids CORS issues by serving images from the same origin as the frontend
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath) {
      return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    // Get API base URL from environment
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.carosa.in';
    
    // Construct full image URL
    // Handle both relative paths (/storage/cars/...) and absolute URLs
    let imageUrl;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // Already absolute URL - extract path
      try {
        const urlObj = new URL(imagePath);
        imageUrl = `${apiBaseUrl}${urlObj.pathname}`;
      } catch {
        imageUrl = imagePath;
      }
    } else {
      // Relative path - prepend API base URL
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      imageUrl = `${apiBaseUrl}${cleanPath}`;
    }

    console.log('🖼️ Proxying image:', imageUrl);

    // Fetch image from backend
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch image:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: response.status }
      );
    }

    // Get image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('❌ Error proxying image:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}


