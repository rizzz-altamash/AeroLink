// app/api/weather/current/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { WeatherService } from '@/lib/weather-service';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'pilot') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get pilot's location from database
    const pilot = await User.findById(session.user.id);
    
    if (!pilot || !pilot.address || !pilot.address.city) {
      // Return mock data if pilot location not found
      return NextResponse.json(WeatherService.getMockWeatherData());
    }

    // Get weather for pilot's city
    const weatherData = await WeatherService.getWeatherByCity(
      pilot.address.city,
      pilot.address.state,
      pilot.address.country || 'IN' // Default to India based on your location
    );

    // Add pilot location info
    weatherData.pilotLocation = {
      city: pilot.address.city,
      state: pilot.address.state,
      country: pilot.address.country
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