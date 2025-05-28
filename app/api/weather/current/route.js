// app/api/weather/current/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'pilot') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock weather data - in production, integrate with a weather API
    const weatherData = {
      temp: 22,
      windSpeed: 12,
      visibility: 10,
      conditions: 'Partly Cloudy',
      flyable: true
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}