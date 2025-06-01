// app/api/hospital/delivery-types-stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const hospitalId = session.user.hospitalId;
    if (!hospitalId) {
      return NextResponse.json({ error: 'No hospital associated with user' }, { status: 400 });
    }

    // Get all deliveries for this hospital
    const deliveries = await Delivery.find({
      $or: [
        { 'sender.hospitalId': hospitalId },
        { 'recipient.hospitalId': hospitalId },
        { 'metadata.orderingHospital': hospitalId }
      ]
    });

    // Define all delivery types
    const deliveryTypes = [
      { type: 'medication', label: 'Medications', color: 'bg-blue-500' },
      { type: 'blood', label: 'Blood Samples', color: 'bg-red-500' },
      { type: 'organ', label: 'Organ for Transplant', color: 'bg-purple-500' },
      { type: 'medical_supplies', label: 'Medical Supplies', color: 'bg-green-500' },
      { type: 'documents', label: 'Medical Documents', color: 'bg-yellow-500' },
      { type: 'other', label: 'Others', color: 'bg-gray-500' }
    ];

    // Count deliveries by type
    const typeCounts = {};
    deliveryTypes.forEach(dt => {
      typeCounts[dt.type] = 0;
    });

    deliveries.forEach(delivery => {
      const packageType = delivery.package?.type || 'other';
      if (typeCounts.hasOwnProperty(packageType)) {
        typeCounts[packageType]++;
      } else {
        typeCounts['other']++;
      }
    });

    // Calculate percentages
    const total = deliveries.length || 1; // Avoid division by zero
    const stats = deliveryTypes.map(dt => ({
      ...dt,
      count: typeCounts[dt.type],
      percentage: Math.round((typeCounts[dt.type] / total) * 100)
    }));

    return NextResponse.json({
      stats,
      total,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching delivery type stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery type statistics' },
      { status: 500 }
    );
  }
}