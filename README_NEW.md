# RentDito - Boarding House Management System

A modern, full-stack MERN application for managing boarding houses with support for multiple user roles: Platform Admins, Landlords, Landlord Admins, and Tenants.

## Features

### 🏢 Property Management
- Create and manage multiple boarding houses
- Room inventory management with real-time availability
- Property documentation and certification storage
- Amenities and facilities listing

### 👥 User Roles & Access Control
- **Platform Admin**: System-wide management and analytics
- **Landlord**: Property ownership and staff management
- **Landlord Admin**: Day-to-day property operations
- **Tenant**: Room booking and lease management

### 💰 Financial Management
- Online rent payment processing
- Payment history and receipt generation
- Invoice management
- Financial analytics and reporting

### 🔧 Maintenance Management
- Tenant maintenance request submission
- Priority-based request tracking
- Multi-status workflow (pending, in-progress, completed)
- Cost tracking and documentation

### 💬 Communication
- In-app messaging between users
- Email notifications
- Announcement system
- Document sharing

### 📊 Analytics & Reporting
- Revenue tracking and trends
- Occupancy rate monitoring
- Payment statistics
- Custom report generation

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Project Structure

```
RentDito_MERN/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── IMPLEMENTATION_PLAN.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/RentDito-MERN.git
cd RentDito-MERN
```

#### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
```

#### 3. Setup Frontend
```bash
cd ../client
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

### Running the Application

#### Development Mode

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

### Demo Credentials

Use these credentials to test the application:

| Role | Email | Password |
|------|-------|----------|
| Landlord | landlord@demo.com | password123 |
| Landlord Admin | admin@demo.com | password123 |
| Tenant | tenant@demo.com | password123 |
| Platform Admin | platformadmin@demo.com | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Properties (Coming Soon)
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Tenants (Coming Soon)
- `GET /api/tenants` - List tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/:id` - Get tenant details
- `PUT /api/tenants/:id` - Update tenant

### Payments (Coming Soon)
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment details

### Maintenance (Coming Soon)
- `GET /api/maintenance` - List requests
- `POST /api/maintenance` - Create request
- `PUT /api/maintenance/:id` - Update request

## Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Authentication system
- [x] Database models
- [x] RBAC middleware
- [x] UI dashboards for all roles

### Phase 2: Core Features (In Progress)
- [ ] Property management CRUD
- [ ] Room management
- [ ] Tenant search and filtering
- [ ] Lease agreement system
- [ ] Document upload

### Phase 3: Financial & Payments
- [ ] Stripe integration
- [ ] Payment processing
- [ ] Invoice generation
- [ ] Financial analytics

### Phase 4: Maintenance & Communication
- [ ] Maintenance request system
- [ ] In-app messaging
- [ ] Email notifications
- [ ] SMS alerts

### Phase 5: Advanced Features
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced analytics
- [ ] Custom report generation
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- All passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Environment variables for sensitive data
- Input validation and sanitization
- CORS enabled for frontend communication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@rentdito.com or open an issue in the GitHub repository.

## Acknowledgments

- Built with React, Express, and MongoDB
- UI components styled with Tailwind CSS
- Icons from Lucide React
- Charts powered by Recharts
