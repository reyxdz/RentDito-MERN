require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');

const seedDemoUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing demo users
    await User.deleteMany({ email: { $in: ['tenant@demo.com', 'landlord@demo.com', 'admin@demo.com', 'platformadmin@demo.com'] } });
    
    // Create demo users
    const demoUsers = [
      {
        fullName: 'Demo Tenant',
        email: 'tenant@demo.com',
        password: 'password123',
        phone: '+1234567890',
        role: 'tenant',
        isVerified: true,
        isActive: true,
        tenantDetails: {
          idType: 'passport',
          currentLeases: [],
          documents: []
        }
      },
      {
        fullName: 'Demo Landlord',
        email: 'landlord@demo.com',
        password: 'password123',
        phone: '+1234567891',
        role: 'landlord',
        isVerified: true,
        isActive: true,
        landlordDetails: {
          businessName: 'Demo Properties Co.',
          registrationNumber: 'REG123456',
          bankDetails: {
            accountName: 'Demo Account',
            accountNumber: '1234567890',
            bankName: 'Demo Bank'
          }
        }
      },
      {
        fullName: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'password123',
        phone: '+1234567892',
        role: 'landlord-admin',
        isVerified: true,
        isActive: true,
        adminDetails: {
          landlordId: null, // Will be set after landlord is created
          assignedProperties: [],
          permissions: ['manage-rooms', 'collect-payments', 'manage-maintenance', 'view-tenants']
        }
      },
      {
        fullName: 'Demo Platform Admin',
        email: 'platformadmin@demo.com',
        password: 'password123',
        phone: '+1234567893',
        role: 'platform-admin',
        isVerified: true,
        isActive: true
      }
    ];
    
    // Create users
    const createdUsers = await User.create(demoUsers);
    
    // Update admin to reference landlord
    const landlord = createdUsers.find(u => u.role === 'landlord');
    const admin = createdUsers.find(u => u.role === 'landlord-admin');
    if (admin && landlord) {
      admin.adminDetails.landlordId = landlord._id;
      await admin.save();
    }
    
    console.log('✅ Demo users created successfully!');
    console.log('\nDemo Credentials:');
    console.log('Tenant: tenant@demo.com / password123');
    console.log('Landlord: landlord@demo.com / password123');
    console.log('Landlord Admin: admin@demo.com / password123');
    console.log('Platform Admin: platformadmin@demo.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  }
};

seedDemoUsers();
