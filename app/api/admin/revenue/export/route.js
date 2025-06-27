// app/api/admin/revenue/export/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';
    const timeRange = searchParams.get('timeRange') || 'week';

    // Fetch revenue data
    const revenueRes = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/revenue/overview?timeRange=${timeRange}`, {
      headers: {
        Cookie: req.headers.get('cookie') || ''
      }
    });
    
    const revenueData = await revenueRes.json();

    if (format === 'csv') {
      // Generate CSV
      const csv = generateCSV(revenueData);
      
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=revenue-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
        }
      });
    } else if (format === 'pdf') {
      // For PDF, we'll return a simple HTML that can be printed as PDF
      // In production, you'd use a library like puppeteer or pdfkit
      const html = generatePDFHTML(revenueData, timeRange);
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename=revenue-report-${timeRange}-${new Date().toISOString().split('T')[0]}.html`
        }
      });
    }
  } catch (error) {
    console.error('Error exporting revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to export revenue data' },
      { status: 500 }
    );
  }
}

function generateCSV(data) {
  let csv = 'Revenue Report\n\n';
  
  // Metrics
  csv += 'Metrics\n';
  csv += 'Total Revenue,Average per Delivery,Growth,Today Revenue,Week Revenue,Month Revenue\n';
  csv += `$${data.metrics.total.toFixed(2)},$${data.metrics.average.toFixed(2)},${data.metrics.growth.toFixed(1)}%,$${data.metrics.todayRevenue.toFixed(2)},$${data.metrics.weekRevenue.toFixed(2)},$${data.metrics.monthRevenue.toFixed(2)}\n\n`;
  
  // Daily/Hourly data
  csv += 'Revenue by Period\n';
  csv += 'Date,Total Revenue,Emergency,Urgent,Routine\n';
  data.chartData.forEach(row => {
    csv += `${row.date},$${row.revenue.toFixed(2)},$${row.emergency.toFixed(2)},$${row.urgent.toFixed(2)},$${row.routine.toFixed(2)}\n`;
  });
  
  // Top Hospitals
  csv += '\nTop Hospitals\n';
  csv += 'Hospital,Revenue\n';
  data.hospitalRevenue.forEach(hospital => {
    csv += `${hospital.name},$${hospital.revenue.toFixed(2)}\n`;
  });
  
  return csv;
}

function generatePDFHTML(data, timeRange) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Revenue Report - ${timeRange}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>Revenue Report - ${timeRange.toUpperCase()}</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      
      <h2>Key Metrics</h2>
      <div>
        <div class="metric">Total Revenue: $${data.metrics.total.toFixed(2)}</div>
        <div class="metric">Average per Delivery: $${data.metrics.average.toFixed(2)}</div>
        <div class="metric">Growth: ${data.metrics.growth.toFixed(1)}%</div>
      </div>
      
      <h2>Revenue by Urgency</h2>
      <table>
        <tr>
          <th>Type</th>
          <th>Revenue</th>
        </tr>
        ${data.urgencyBreakdown.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>$${item.value.toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Top Hospitals</h2>
      <table>
        <tr>
          <th>Hospital</th>
          <th>Revenue</th>
        </tr>
        ${data.hospitalRevenue.slice(0, 10).map(hospital => `
          <tr>
            <td>${hospital.name}</td>
            <td>$${hospital.revenue.toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;
}