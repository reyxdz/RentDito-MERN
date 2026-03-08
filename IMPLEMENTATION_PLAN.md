# RentDito MERN - Implementation Plan

## Project Overview
A web application for boarding house management where **Platform Admins**, **Landlords**, **Landlord Admins**, and **Tenants** can manage properties, leases, payments, and maintenance requests through role-based dashboards.

---

## Role Structure & Permissions

### 1. Platform Admin
**Responsibilities:**
- User registration/verification (approve/reject landlords)
- System-wide analytics & reporting
- Handle payment disputes & escalations
- Manage platform policies & fee structures
- Monitor suspicious activity across all properties
- User account management (suspend/delete)

**Dashboard Access:**
- User management panel
- Analytics dashboard
- Payment/dispute reports
- Audit logs
- System configuration

---

### 2. Landlord
**Responsibilities:**
- Create & manage multiple boarding houses/properties
- Hire & manage Landlord Admins (assign permissions per property)
- Set operational policies for their properties
- View consolidated financial reports across all buildings
- Manage lease agreements & contracts
- Approve/manage tenant applications
- Access audit logs for their properties

**Dashboard Access:**
- Property management
- Financial reports & analytics
- Staff (Landlord Admin) management
- Tenant roster (all properties)
- Lease management
- Payment tracking
- Settings & permissions

---

### 3. Landlord's Admin
**Responsibilities:**
- Day-to-day property operations (assigned properties only)
- Manage tenant roster & documentation
- Collect & track payments
- Handle maintenance requests
- Manage room availability & booking
- Upload/store documents (leases, receipts, contracts)
- Communicate with tenants
- Generate reports for their assigned properties

**Restrictions:**
- Cannot approve new landlords
- Cannot access other landlord's properties
- Cannot manage permissions (landlord-only)
- Limited to assigned properties/buildings

**Dashboard Access:**
- Assigned property management
- Tenant management & communication
- Payment collection & tracking
- Maintenance request handling
- Document management
- Reports (assigned properties only)

---

### 4. Tenant
**Responsibilities:**
- Search & filter available boarding houses & rooms
- Book/apply for rooms
- View lease agreements & contracts
- Pay rent online
- Submit & track maintenance requests
- Update profile & personal documents

**Dashboard Access:**
- Room search & booking
- Lease details & status
- Payment history & rent payment portal
- Maintenance request submission
- Profile management
- Document storage

---

## Core Features by Module

### User Management & Authentication
- User registration (separate flows for each role)
- Email verification
- JWT-based authentication
- Password reset functionality
- Profile management
- Role-based access control (RBAC)
- Permission scoping for Landlord Admins

### Property Management
- Create/edit boarding houses
- Room inventory management
- Room photos & descriptions
- Availability calendar
- Pricing per room/building
- Amenities & facilities listing
- Document storage (certificates, licenses)

### Tenant Management
- Application/booking system
- Tenant verification documents
- Emergency contact information
- Lease assignment & tracking
- Tenant status (active, inactive, evicted)
- Communication history

### Financial Management
- Rent payment processing (Stripe/PayPal integration)
- Payment history & receipts
- Invoice generation
- Late payment tracking & reminders
- Financial reports & analytics
- Dispute resolution

### Maintenance Management
- Maintenance request submission
- Status tracking (pending, in-progress, resolved)
- Assignment to maintenance staff
- Photo documentation
- Cost tracking
- Completion verification

### Communication
- In-app messaging between tenants & landlord/admin
- Email notifications
- SMS alerts (optional)
- Announcement broadcasting

### Document Management
- Upload & store contracts/leases
- Digital signatures (optional)
- Audit trail for documents
- Download & print functionality

### Analytics & Reporting
- Occupancy rates
- Revenue analytics
- Payment statistics
- Maintenance trends
- User activity logs
- Custom report generation

---

## Technical Stack

### Frontend
- **Framework:** React.js
- **State Management:** Redux/Redux Toolkit or Context API
- **Styling:** Tailwind CSS or Material-UI
- **Real-Time:** Socket.io client
- **Charts:** Chart.js or Recharts
- **Form Validation:** React Hook Form + Zod
- **Notifications:** React Toastify or Sonner

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT + bcrypt
- **Database:** MongoDB (primary), PostgreSQL (optional for relational data)
- **Real-Time:** Socket.io server
- **File Storage:** AWS S3 or Cloudinary
- **Email:** Nodemailer or SendGrid
- **Payment:** Stripe/PayPal SDK
- **Validation:** Joi or Zod
- **Logging:** Winston or Morgan

### DevOps & Deployment
- **Version Control:** Git/GitHub
- **Containerization:** Docker (optional)
- **Deployment:** Heroku, Railway, or AWS
- **Database Hosting:** MongoDB Atlas or AWS RDS
- **Environment Variables:** .env files with dotenv

---

## Data Models

### User
```
{
  id, email, password (hashed), fullName, phone, role,
  avatar, isVerified, isActive, createdAt, updatedAt,
  // Additional fields by role
  landlordDetails (if landlord),
  adminDetails { assignedProperties[], permissions[] } (if landlord admin),
  tenantDetails { currentLeases[], documents[] } (if tenant)
}
```

### Property/Boarding House
```
{
  id, landlordId, name, address, city, state, contact,
  description, amenities[], photos[], documentation[],
  totalRooms, occupantCount, status, createdAt, updatedAt
}
```

### Room
```
{
  id, propertyId, roomNumber, type, capacity, price,
  description, photos[], availability, status,
  amenities[], currentTenant (null if vacant), createdAt, updatedAt
}
```

### Lease/Agreement
```
{
  id, tenantId, roomId, propertyId, startDate, endDate,
  rentAmount, depositAmount, terms, documentUrl,
  status (active, pending, expired, terminated), createdAt, updatedAt
}
```

### Payment
```
{
  id, tenantId, leaseId, propertyId, amount, dueDate, paidDate,
  paymentMethod, transactionId (Stripe/PayPal), status (pending, paid, overdue),
  receiptUrl, createdAt, updatedAt
}
```

### Maintenance Request
```
{
  id, tenantId, propertyId, roomId, description, priority,
  category (plumbing, electrical, etc.), photos[], status,
  assignedTo (landlord admin), startDate, completionDate, cost,
  createdAt, updatedAt
}
```

### Landlord Admin / Staff
```
{
  id, landlordId, userId, role, assignedProperties[], permissions[],
  status, joinDate, createdAt, updatedAt
}
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Setup project structure (React + Express)
- [ ] Configure MongoDB/Database
- [ ] Implement authentication (JWT, user registration, login)
- [ ] Create User, Property, Room data models
- [ ] Build basic RBAC middleware
- [ ] Setup environment configuration

### Phase 2: Core Features (Weeks 3-4)
- [ ] Property management (landlord can create/edit properties)
- [ ] Room management & inventory
- [ ] Tenant search & filtering
- [ ] Basic lease agreement system
- [ ] User dashboards (basic layout)
- [ ] Document upload functionality

### Phase 3: Financial & Payments (Weeks 5-6)
- [ ] Integrate Stripe/PayPal for payments
- [ ] Payment processing & tracking
- [ ] Invoice generation
- [ ] Payment history & receipts
- [ ] Financial reports & analytics
- [ ] Late payment notifications

### Phase 4: Maintenance & Communication (Weeks 7-8)
- [ ] Maintenance request system
- [ ] Request assignment & tracking
- [ ] In-app messaging
- [ ] Email notifications
- [ ] SMS alerts (optional)
- [ ] Announcement system

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Real-time notifications (Socket.io)
- [ ] Digital lease signatures (optional)
- [ ] Advanced analytics & reporting
- [ ] Custom report generation
- [ ] Bulk operations
- [ ] Multi-language support (optional)

### Phase 6: Testing & Polish (Weeks 11-12)
- [ ] Unit testing (Jest)
- [ ] Integration testing
- [ ] E2E testing (Cypress/Playwright)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Bug fixes

### Phase 7: Deployment (Week 13)
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring & logging setup
- [ ] Documentation

---

## Security Considerations

- **Authentication:** JWT tokens with refresh tokens, secure password hashing
- **Authorization:** Role-based access control with property/building scoping
- **Data Protection:** Encrypt sensitive data (payments, documents)
- **API Security:** CORS, rate limiting, input validation
- **Payment Security:** PCI-DSS compliance, use payment processor SDKs
- **Audit Logging:** Track all admin/landlord admin actions
- **HTTPS:** Enforce SSL/TLS
- **SQL Injection/XSS Prevention:** Input sanitization & parameterized queries

---

## Optional Enhancements

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Digital signatures for leases
- [ ] Advanced predictive analytics
- [ ] AI-powered tenant screening
- [ ] Multi-language support
- [ ] White-label customization for different regions
- [ ] Integration with accounting software
- [ ] API for third-party integrations
- [ ] Mobile responsiveness optimization

---

## Success Metrics

- User authentication successful for all 4 roles
- Property & room management fully functional
- Payment processing with 99.9% uptime
- Notification system delivering emails in <5 seconds
- Platform loads in <3 seconds
- Zero critical security vulnerabilities
- All CRUD operations tested
