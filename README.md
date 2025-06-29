# AeroLink - Medical Delivery Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay" />
</div>

<div align="center">
  <h2>🏥 Revolutionizing Healthcare Delivery with Fixed-Wing V-TOL UAVs</h2>
  <p><em>End-to-end platform transforming how hospitals receive critical medical supplies</em></p>
  
  <!-- [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rizzz-altamash/AeroLink) -->
</div>

---

## 🌟 Platform Overview

AeroLink is a **full-stack medical delivery platform** built from scratch, leveraging cutting-edge drone technology to revolutionize healthcare logistics. Our intelligent system connects hospitals, medical staff, and pilots through a seamless ecosystem powered by advanced UAV technology.

## 🔐 Smart Authentication & Onboarding

### Multi-Role Architecture
- **🏥 Hospital Admin** - Complete hospital management and oversight
- **👨‍⚕️ Medical Staff** - Order management and delivery tracking  
- **✈️ Pilot** - Flight operations and delivery execution
- **🛡️ System Admin** - Platform-wide administration

### Advanced Security Features
- **🧠 Intelligent Hospital Detection** - First registrant automatically becomes admin
- **🗺️ Address-to-Coordinates Magic** - Automatic geocoding for precise delivery locations
- **📧 Email Verification** - Custom SHA-256 token generation system
- **🔑 OAuth Integration** - Google sign-in alongside traditional credentials
- **🔒 Bcrypt Security** - 12-round password salting for maximum protection

## 💰 Hospital Management & Payments

### Integrated Payment System
- **⚡ Smart Verification Flow** - Payment triggers automatic hospital verification
- **💳 Razorpay Integration** - Unique customer ID generation for each hospital
- **💎 Multi-Payment Support** - Cards, UPI, Net Banking with intelligent defaults
- **🏧 Auto-Deduction System** - Seamless payment on delivery confirmation
- **🔄 Failure Handling** - Robust retry mechanisms with admin notifications

## 📦 Intelligent Delivery System

### Two-Way Delivery Network
- **📥 Incoming Orders** - Hospitals ordering from central warehouse
- **📤 Outgoing Deliveries** - Hospital-to-hospital and patient transfers

### Smart Logistics Engine
- **🚨 3-Tier Urgency System**
  - Emergency (auto-approved)
  - Urgent (2-hour deadline)
  - Routine (standard processing)
- **📏 Distance Calculator** - Haversine formula for accurate aerial distances
- **💡 Dynamic Pricing Engine** - 7-factor calculation system
  - Distance + Weight + Urgency + Special handling + Weather conditions
- **📊 Real-time Status Tracking** - 11-stage delivery pipeline with complete timeline

## 👨‍✈ Drone Pilot Assignment Intelligence

### Smart Pilot Management
- **🌍 State-Based Filtering** - Pilots only see deliveries in their operational area
- **⚖️ Workload Balancing** - Real-time assignment distribution
- **📍 Address Matching** - Automatic pilot-hospital state verification
- **📈 Performance Tracking** - Success rates, flight hours, daily operations

## 🔔 Smart Notification System

### Priority-Based Communications
- **🚨 Priority Levels** - Urgent, High, Medium, Low with distinct UI treatments
- **👥 Role-Based Routing** - Customized notifications per user type
- **⚡ Action Required Flags** - Pilots receive actionable notifications
- **📱 Bulk Operations** - Mark all read, delete all functionality
- **🔍 Advanced Filtering** - By type, priority, date range, read status

## 📊 Comprehensive Analytics Dashboard

### Real-Time Business Intelligence
- **📈 Delivery Analytics** - Today/Week/Month views with urgency breakdowns
- **💰 Revenue Tracking** - Real-time revenue with growth percentages
- **⏰ Peak Hours Analysis** - Resource planning optimization
- **🏥 Hospital-wise Analytics** - Incoming vs Outgoing delivery patterns
- **👥 Staff Activity Monitoring** - Performance tracking across all roles
- **📋 Export Everything** - CSV/PDF reports for all data

## 🌤️ Weather Integration for Drone Pilots

### Flight Safety Intelligence
- **📍 City-Based Weather** - Real-time conditions for pilot locations
- **🌪️ Flight Safety Parameters** - Wind speed, visibility, temperature monitoring
- **🔄 Mock Data Fallback** - System resilience even with API failures

## 💳 Advanced Payment Processing

### Enterprise-Grade Financial Management
- **🔗 Webhook Listeners** - Real-time payment status updates
- **📜 Payment History** - Complete audit trail for all transactions
- **🧾 Invoice Generation** - Automatic invoice numbering system
- **📊 Payment Reports** - Detailed breakdowns with staff-wise analytics
- **❌ Failed Payment Handling** - Automatic admin notifications

## 🤖 Intelligent Approval System

### Automated Decision Making
- **🚨 Auto-Approval Logic** - Emergency deliveries bypass manual approval
- **⏰ Deadline Tracking** - Urgent deliveries auto-approve after 2 hours
- **📋 Rejection Tracking** - Detailed logging of rejection reasons
- **🏥 Multi-Level Permissions** - Hospital admins can only approve their facility's deliveries

## 🔄 Delivery Lifecycle Management

### 11-Stage Pipeline Management
**Created** → **Pending Approval** → **Approved** → **Assigned** → **In Transit** → **Pending Confirmation** → **Delivered**

- **❌ Cancellation Workflows** - Role-based cancellation permissions
- **✅ Confirmation System** - Two-step delivery verification
- **📅 Timeline Tracking** - Every status change logged with timestamps

## 🛠️ Technical Excellence

### Backend Architecture
- **🔗 70+ API Endpoints** - RESTful architecture with proper status codes
- **🗄️ MongoDB Aggregation** - Complex analytics queries
- **👥 Population Queries** - Efficient relationship data fetching
- **⚡ Promise.all Optimization** - Parallel notification processing
- **🌐 Geospatial Queries** - Location-based pilot filtering
- **⏱️ Cron-Ready Architecture** - Scheduled auto-approval system
- **🛡️ Error Boundary Implementation** - Graceful error handling throughout

### Admin Superpowers
- **📊 Activity Dashboard** - Real-time system activity feed
- **🏥 Hospital Verification Panel** - Approve/suspend hospital operations
- **🤖 Pilot Assignment Algorithm** - Smart location-based matching
- **📈 Revenue Forecasting** - Trend-based business predictions
- **📊 System-wide Statistics** - Total deliveries, active drones, revenue metrics

## 🧠 Smart Features That Show Intelligence

### Automated Intelligence
- **📍 Coordinate Extraction** - Automatic address-to-coordinates conversion
- **🌍 State Detection** - Auto-detecting pilot service areas
- **💰 Smart Pricing** - 7-factor dynamic pricing algorithm
- **👑 Auto Role Assignment** - First hospital user becomes admin
- **⏰ Deadline Calculation** - Automatic approval deadlines for urgent deliveries
- **🎯 Distance-based Filtering** - Showing only relevant pilots
- **💳 Payment Validation** - Verifying payment methods before activation

### Data Intelligence
- **📊 Time-based Analytics** - Hourly, daily, weekly, monthly insights
- **🚨 Urgency Distribution** - Understanding delivery pattern analysis
- **✅ Success Rate Tracking** - Pilot and hospital performance metrics
- **⏰ Peak Time Detection** - Resource allocation optimization
- **📈 Delivery Pattern Analysis** - Incoming vs Outgoing trend analysis

## 🔒 Security Implementations

### Enterprise Security Standards
- **🔐 JWT Token Management** - Secure session handling
- **👤 Role-Based Access Control** - 4-tier permission system
- **🛡️ Input Validation** - SQL injection and XSS prevention
- **🔒 Secure Password Storage** - Bcrypt with proper salting
- **🚫 API Rate Limiting** - DDoS protection architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Razorpay merchant account
- Weather API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rizzz-altamash/AeroLink.git
   cd AeroLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   EMAIL_SERVICE=brevo
   BREVO_SMTP_KEY=your_smtp_key
   EMAIL_FROM=DroneDelivery <noreply@your_domain.com>
   OPENWEATHER_API_KEY==your_weather_api_key
   RAZORPAY_KEY_ID=your_razorpay_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook
   USE_PAYMENT_LINKS=true
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Access the platform**
   
   Open [http://localhost:3000](http://localhost:3000) and start revolutionizing healthcare delivery! 🚀

## 📊 System Metrics

- **🔗 70+ API Endpoints** - Comprehensive backend coverage
- **📋 11-Stage Pipeline** - Complete delivery lifecycle
- **👥 4 User Roles** - Multi-tier access control
- **📊 7-Factor Pricing** - Dynamic cost calculation
- **🌍 State-Based Filtering** - Geographic intelligence
- **⏰ Real-time Tracking** - Live status updates
- **📈 Advanced Analytics** - Business intelligence dashboard

## 🎯 Key Differentiators

### Healthcare Innovation
- **🚁 Fixed-Wing V-TOL Integration** - Next-generation UAV technology
- **🏥 Hospital-Centric Design** - Built specifically for medical logistics
- **🚨 Emergency Response** - Automated urgent delivery handling
- **💊 Medical Supply Chain** - Specialized for healthcare logistics

### Technical Excellence
- **🧠 Intelligent Automation** - Smart decision-making throughout
- **📊 Real-time Analytics** - Live business intelligence
- **🔒 Enterprise Security** - Banking-grade security measures
- **⚡ Performance Optimized** - Scalable architecture design

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with one click!

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions to advance healthcare delivery technology!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/medical-innovation`)
3. Commit changes (`git commit -m 'Add revolutionary feature'`)
4. Push to branch (`git push origin feature/medical-innovation`)
5. Open a Pull Request

## 📜 License

Licensed under MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Healthcare professionals who inspired this platform
- Drone technology pioneers advancing UAV capabilities
- Open-source community enabling innovation
- Medical institutions trusting our technology

## 📞 Contact & Support

- 🐛 **Issues**: Open a GitHub issue
- 💬 **Discussions**: GitHub Discussions
- 📧 **Email**: [rizzzaltamash@gmail.com]
- 🌐 **Website**: [aerolink-riz.vercel.app]

---

<div align="center">
  <h3>🏥 Transforming Healthcare Delivery, One Flight at a Time</h3>
  <p><strong>AeroLink - Where Medical Innovation Takes Flight</strong> 🚁</p>
  <p>⭐ Star this repository to support healthcare innovation!</p>
</div>

## 🎯 Future Roadmap

- [ ] 🤖 Emergency delivery auto-approval system
- [ ] 🌐 Multi-language support for global deployment
- [ ] 📱 Mobile first approach for iOS/Android
- [ ] 🔗 Integration with hospital management systems
- [ ] 🌍 International expansion capabilities
- [ ] 🔮 Predictive analytics for demand forecasting

---

*Built with ❤️ for healthcare workers worldwide*
