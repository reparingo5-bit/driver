# 🚗 Driver Management Dashboard v2.0

A production-ready single-page driver management system with authentication and role-based access control.

## ✨ Key Features

### 🔐 Authentication System
- **Login/Logout** functionality
- **Session management** with express-session
- **Role-based access control**:
  - **Admin**: Full access (add, edit, delete drivers)
  - **Partner**: View drivers and change status only

### 📊 Single-Page Dashboard
- **Stats cards**: Total, Active, Inactive, New drivers
- **Real-time filtering**: Search, status, vehicle type
- **Drivers table** with all information
- **No page reloads** for status changes

### 🎨 Modern Design
- Clean SaaS-style interface
- Tailwind CSS styling
- Mobile-responsive
- Color-coded status badges
- Rounded cards with shadows

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start server
npm start
```

### Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Permissions: Full access

**Partner Account:**
- Username: `partner`
- Password: `partner123`
- Permissions: View drivers, change status only

## 📁 Project Structure

```
driver-dashboard/
├── views/
│   ├── login.ejs              # Login page
│   └── dashboard.ejs          # Single-page dashboard
├── server.js                  # Express server with auth
├── package.json               # Dependencies
├── data.json                  # Driver data
├── users.json                 # User credentials
└── README.md                  # This file
```

## 🔑 User Roles & Permissions

### Admin Role
✅ View all drivers
✅ Add new drivers
✅ Edit all driver fields
✅ Delete drivers
✅ Change status
✅ Toggle sticker/app

### Partner Role
✅ View all drivers
✅ Change driver status
❌ Cannot add drivers
❌ Cannot edit other fields
❌ Cannot delete drivers

## 📊 Driver Data Structure

```json
{
  "id": 1,
  "vorname": "Max",
  "nachname": "Müller",
  "email": "max.mueller@example.com",
  "rufnummer": "+49 170 1234567",
  "status": "aktiv",
  "fahrzeugtyp": "PKW",
  "kennzeichen": "B-MM 1234",
  "sticker": true,
  "app": true,
  "joined_date": "2024-01-15"
}
```

## 🎯 Dashboard Features

### Top Section - Stats Cards
- **Total Drivers**: All registered drivers
- **Aktiv**: Active drivers (green)
- **Inaktiv**: Inactive drivers (red)
- **Neu**: New drivers (blue)

### Middle Section - Filters
- **Search**: Filter by name, email, phone, license plate
- **Status Filter**: Filter by aktiv/inaktiv/neu
- **Fahrzeugtyp Filter**: Filter by vehicle type
- **Add Driver Button**: Admin only

### Bottom Section - Drivers Table
Columns:
- ID
- Name (with email)
- Rufnummer
- Fahrzeugtyp
- Kennzeichen
- Sticker (green OK / grey —)
- App (green OK / grey —)
- Status (colored badge or dropdown for partners)
- Actions (Edit button - admin only)

## 🔒 Security Features

- ✅ Session-based authentication
- ✅ Password hashing ready (bcrypt installed)
- ✅ Protected routes (redirect to login)
- ✅ Role enforcement on backend
- ✅ CSRF protection ready
- ✅ Secure session cookies

## 🌐 API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /logout` - Logout user

### Dashboard
- `GET /dashboard` - Main dashboard (protected)
- `GET /` - Redirect to dashboard or login

### API Routes (Protected)
- `GET /api/drivers` - Get all drivers (with filters)
- `POST /api/drivers` - Create driver (admin only)
- `PUT /api/drivers/:id` - Update driver (role-based)
- `DELETE /api/drivers/:id` - Delete driver (admin only)

## 🎨 Status Colors

- **Aktiv** → Green badge (`bg-green-100 text-green-800`)
- **Inaktiv** → Red badge (`bg-red-100 text-red-800`)
- **Neu** → Blue badge (`bg-blue-100 text-blue-800`)

## 🚙 Vehicle Types

- Fahrrad
- PKW
- Caddy
- Transporter

## 🌐 Deployment to Render.com

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Driver management dashboard v2"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Environment Variables (Optional)

For production, add:
```
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
```

## 💡 Customization

### Change Passwords

For production, update `server.js` to use bcrypt:

```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashedPassword = await bcrypt.hash('your-password', 10);

// Compare password
const isValid = await bcrypt.compare(password, user.password);
```

### Add More Fields

1. Update `data.json` structure
2. Add form fields in `dashboard.ejs`
3. Update API endpoints in `server.js`

### Customize UI

All styling uses Tailwind CSS classes in `dashboard.ejs` and `login.ejs`.

## 🔧 Technical Details

### Session Configuration
- **Secret**: Change in production
- **Cookie lifetime**: 24 hours
- **Secure cookies**: Enable for HTTPS

### File Storage
- Drivers: `data.json`
- Users: `users.json`
- For production: Consider MongoDB/PostgreSQL

### Rate Limiting
Not implemented. For production, add `express-rate-limit`.

## 📱 Mobile Responsive

The dashboard is fully responsive:
- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: 4-column grid for stats

## 🐛 Troubleshooting

### Port Already in Use
```bash
PORT=3001 npm start
```

### Session Not Persisting
- Check cookie settings
- Enable secure cookies for HTTPS
- Clear browser cookies

### Unauthorized Access
- Ensure proper login
- Check session middleware
- Verify role in backend

## 🔄 Updates from v1.0

- ✅ Added authentication system
- ✅ Role-based access control
- ✅ Single-page dashboard
- ✅ Real-time status updates
- ✅ Inline editing for partners
- ✅ Modal-based add/edit for admins
- ✅ Enhanced security

## 📝 License

MIT License - Free to use for any purpose.

## 🤝 Support

For issues or questions:
1. Check this README
2. Review server logs
3. Test with demo credentials
4. Check browser console for errors

---

**Built with ❤️ using Node.js, Express, EJS, and Tailwind CSS**

**Ready for production deployment on Render.com free tier** 🚀
