// scripts/selective-cleanup.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

// Color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// MongoDB connection
async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log(`${colors.green}✓ Connected to MongoDB${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ MongoDB connection failed:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Define schemas
const NotificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  title: String,
  message: String,
  read: Boolean,
  createdAt: Date,
  data: Object,
  priority: String
}, { 
  strict: false,
  collection: 'notifications' 
});

const DeliverySchema = new mongoose.Schema({
  orderId: String,
  status: String,
  package: Object,
  sender: Object,
  recipient: Object,
  createdAt: Date,
  updatedAt: Date,
  metadata: Object
}, { 
  strict: false,
  collection: 'deliveries' 
});

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  userType: String,
  hospitalId: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  createdAt: Date,
  metadata: Object
}, { 
  strict: false,
  collection: 'users' 
});

const HospitalSchema = new mongoose.Schema({
  name: String,
  registrationNumber: String,
  type: String,
  verificationStatus: String,
  address: Object,
  contactInfo: Object,
  createdAt: Date
}, { 
  strict: false,
  collection: 'hospitals' 
});

// Create models
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', DeliverySchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Show current database statistics
async function showStats() {
  console.log(`\n${colors.blue}📊 Current Database Statistics:${colors.reset}`);
  
  // Notifications stats
  const totalNotifications = await Notification.countDocuments();
  const readNotifications = await Notification.countDocuments({ read: true });
  const unreadNotifications = await Notification.countDocuments({ read: false });
  const oldNotifications = await Notification.countDocuments({
    createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });
  
  console.log(`\n${colors.yellow}📬 Notifications:${colors.reset}`);
  console.log(`  Total: ${totalNotifications}`);
  console.log(`  Read: ${readNotifications}`);
  console.log(`  Unread: ${unreadNotifications}`);
  console.log(`  Older than 30 days: ${oldNotifications}`);
  
  // Deliveries stats
  const totalDeliveries = await Delivery.countDocuments();
  const activeDeliveries = await Delivery.countDocuments({
    status: { $in: ['pending', 'pending_approval', 'approved', 'assigned', 'pickup', 'in_transit'] }
  });
  const completedDeliveries = await Delivery.countDocuments({
    status: { $in: ['delivered', 'cancelled', 'failed'] }
  });
  
  console.log(`\n${colors.yellow}📦 Deliveries:${colors.reset}`);
  console.log(`  Total: ${totalDeliveries}`);
  console.log(`  Active: ${activeDeliveries}`);
  console.log(`  Completed/Cancelled: ${completedDeliveries}`);
  
  // Users stats
  const totalUsers = await User.countDocuments();
  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  
  console.log(`\n${colors.yellow}👥 Users:${colors.reset}`);
  console.log(`  Total: ${totalUsers}`);
  usersByRole.forEach(role => {
    console.log(`  ${role._id || 'No role'}: ${role.count}`);
  });
  
  // Hospitals stats
  const totalHospitals = await Hospital.countDocuments();
  const verifiedHospitals = await Hospital.countDocuments({ verificationStatus: 'verified' });
  const pendingHospitals = await Hospital.countDocuments({ verificationStatus: 'pending' });
  
  console.log(`\n${colors.yellow}🏥 Hospitals:${colors.reset}`);
  console.log(`  Total: ${totalHospitals}`);
  console.log(`  Verified: ${verifiedHospitals}`);
  console.log(`  Pending: ${pendingHospitals}`);
}

// Main cleanup function
async function selectiveCleanup() {
  console.log(`${colors.cyan}
╔═══════════════════════════════════════════╗
║      SELECTIVE DATABASE CLEANUP           ║
║      Choose what you want to delete       ║
╚═══════════════════════════════════════════╝${colors.reset}`);

  try {
    // Connect to database
    await connectDB();
    
    // Show current stats
    await showStats();
    
    // Show menu
    console.log(`\n${colors.magenta}🧹 Cleanup Options:${colors.reset}`);
    console.log('\n--- Notifications ---');
    console.log('1. Delete ALL Notifications');
    console.log('2. Delete Read Notifications Only');
    console.log('3. Delete Old Notifications (30+ days)');
    
    console.log('\n--- Deliveries ---');
    console.log('4. Delete ALL Deliveries');
    console.log('5. Delete Completed/Cancelled Deliveries Only');
    
    console.log('\n--- Users ---');
    console.log('6. Delete ALL Users (⚠️  DANGEROUS)');
    console.log('7. Delete Inactive Users Only');
    console.log('8. Delete Users by Role');
    
    console.log('\n--- Hospitals ---');
    console.log('9. Delete ALL Hospitals (⚠️  DANGEROUS)');
    console.log('10. Delete Unverified Hospitals Only');
    
    console.log('\n--- Bulk Operations ---');
    console.log('11. Delete ALL DATA (⚠️  EXTREMELY DANGEROUS)');
    console.log('12. Custom Date Range Cleanup');
    
    console.log('\n--- Other ---');
    console.log('13. Show Stats Again');
    console.log('14. Exit Without Deleting');
    
    const choice = await question(`\n${colors.cyan}Enter your choice (1-14): ${colors.reset}`);
    
    let result;
    
    switch (choice.trim()) {
      case '1':
        console.log(`\n${colors.red}⚠️  Delete ALL notifications?${colors.reset}`);
        const confirm1 = await question('Type "yes" to confirm: ');
        if (confirm1.toLowerCase() === 'yes') {
          result = await Notification.deleteMany({});
          console.log(`${colors.green}✓ Deleted ${result.deletedCount} notifications${colors.reset}`);
        } else {
          console.log('Cancelled.');
        }
        break;
        
      case '2':
        result = await Notification.deleteMany({ read: true });
        console.log(`${colors.green}✓ Deleted ${result.deletedCount} read notifications${colors.reset}`);
        break;
        
      case '3':
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        result = await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
        console.log(`${colors.green}✓ Deleted ${result.deletedCount} old notifications${colors.reset}`);
        break;
        
      case '4':
        console.log(`\n${colors.red}⚠️  Delete ALL deliveries?${colors.reset}`);
        const confirm4 = await question('Type "yes" to confirm: ');
        if (confirm4.toLowerCase() === 'yes') {
          result = await Delivery.deleteMany({});
          console.log(`${colors.green}✓ Deleted ${result.deletedCount} deliveries${colors.reset}`);
        } else {
          console.log('Cancelled.');
        }
        break;
        
      case '5':
        result = await Delivery.deleteMany({ 
          status: { $in: ['delivered', 'cancelled', 'failed'] } 
        });
        console.log(`${colors.green}✓ Deleted ${result.deletedCount} completed deliveries${colors.reset}`);
        break;
        
      case '6':
        console.log(`\n${colors.red}⚠️  WARNING: This will delete ALL users including admins!${colors.reset}`);
        console.log(`${colors.red}This will break all relationships and you'll need to re-register!${colors.reset}`);
        const confirm6 = await question('Type "DELETE ALL USERS" to confirm: ');
        if (confirm6 === 'DELETE ALL USERS') {
          result = await User.deleteMany({});
          console.log(`${colors.green}✓ Deleted ${result.deletedCount} users${colors.reset}`);
        } else {
          console.log('Cancelled.');
        }
        break;
        
      case '7':
        result = await User.deleteMany({ isActive: false });
        console.log(`${colors.green}✓ Deleted ${result.deletedCount} inactive users${colors.reset}`);
        break;
        
      case '8':
        console.log('\nAvailable roles: admin, hospital_admin, medical_staff, pilot, customer');
        const role = await question('Enter role to delete (or "cancel"): ');
        if (role.toLowerCase() !== 'cancel') {
          console.log(`\n${colors.red}⚠️  Delete all ${role} users?${colors.reset}`);
          const confirmRole = await question('Type "yes" to confirm: ');
          if (confirmRole.toLowerCase() === 'yes') {
            result = await User.deleteMany({ role });
            console.log(`${colors.green}✓ Deleted ${result.deletedCount} ${role} users${colors.reset}`);
          }
        }
        break;
        
      case '9':
        console.log(`\n${colors.red}⚠️  WARNING: This will delete ALL hospitals!${colors.reset}`);
        console.log(`${colors.red}This will break all hospital-user relationships!${colors.reset}`);
        const confirm9 = await question('Type "DELETE ALL HOSPITALS" to confirm: ');
        if (confirm9 === 'DELETE ALL HOSPITALS') {
          result = await Hospital.deleteMany({});
          console.log(`${colors.green}✓ Deleted ${result.deletedCount} hospitals${colors.reset}`);
        } else {
          console.log('Cancelled.');
        }
        break;
        
      case '10':
        result = await Hospital.deleteMany({ 
          verificationStatus: { $ne: 'verified' } 
        });
        console.log(`${colors.green}✓ Deleted ${result.deletedCount} unverified hospitals${colors.reset}`);
        break;
        
      case '11':
        console.log(`\n${colors.red}⚠️  EXTREME WARNING: This will delete EVERYTHING!${colors.reset}`);
        console.log(`${colors.red}All users, hospitals, deliveries, and notifications will be permanently deleted!${colors.reset}`);
        const confirm11 = await question('Type "DELETE EVERYTHING PERMANENTLY" to confirm: ');
        if (confirm11 === 'DELETE EVERYTHING PERMANENTLY') {
          const notifResult = await Notification.deleteMany({});
          const delivResult = await Delivery.deleteMany({});
          const userResult = await User.deleteMany({});
          const hospResult = await Hospital.deleteMany({});
          
          console.log(`\n${colors.green}Cleanup Complete:${colors.reset}`);
          console.log(`✓ Deleted ${notifResult.deletedCount} notifications`);
          console.log(`✓ Deleted ${delivResult.deletedCount} deliveries`);
          console.log(`✓ Deleted ${userResult.deletedCount} users`);
          console.log(`✓ Deleted ${hospResult.deletedCount} hospitals`);
        } else {
          console.log('Cancelled.');
        }
        break;
        
      case '12':
        const days = await question('\nDelete items older than how many days? ');
        const daysNum = parseInt(days);
        if (!isNaN(daysNum)) {
          const cutoffDate = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000);
          
          console.log('\nWhat to delete?');
          console.log('1. Notifications only');
          console.log('2. Deliveries only');
          console.log('3. Both');
          const subChoice = await question('Choice: ');
          
          if (subChoice === '1' || subChoice === '3') {
            const notifResult = await Notification.deleteMany({ createdAt: { $lt: cutoffDate } });
            console.log(`${colors.green}✓ Deleted ${notifResult.deletedCount} notifications older than ${daysNum} days${colors.reset}`);
          }
          if (subChoice === '2' || subChoice === '3') {
            const delivResult = await Delivery.deleteMany({ createdAt: { $lt: cutoffDate } });
            console.log(`${colors.green}✓ Deleted ${delivResult.deletedCount} deliveries older than ${daysNum} days${colors.reset}`);
          }
        } else {
          console.log('Invalid number.');
        }
        break;
        
      case '13':
        await showStats();
        const continueChoice = await question('\nPress Enter to return to menu...');
        await selectiveCleanup(); // Restart menu
        return;
        
      case '14':
        console.log(`${colors.yellow}Exiting without changes...${colors.reset}`);
        break;
        
      default:
        console.log(`${colors.red}Invalid choice!${colors.reset}`);
    }
    
    // Show final stats if any deletion was made
    if (!['13', '14'].includes(choice)) {
      console.log(`\n${colors.cyan}Final Statistics:${colors.reset}`);
      await showStats();
    }
    
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log(`\n${colors.green}✓ Disconnected from MongoDB${colors.reset}`);
    process.exit(0);
  }
}

// Run the cleanup
selectiveCleanup().catch(console.error);