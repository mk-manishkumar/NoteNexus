# NoteNexus

NoteNexus is a full-stack web application for creating, managing, and organizing notes with features like archiving, soft deletion, and role-based access control.

## Deployed Link

Both frontend & backend are deployed on Vercel. For live project, [Click here](https://notenexus-mk.vercel.app/)

## Features

- **Authentication & Authorization**
  - User registration and login
  - Guest user access with auto-logout after 10 minutes
  - JWT-based authentication with secure HTTP-only cookies
  - Role-based access control (Regular users vs Guest users)

- **Note Management**
  - Create, read, update, and delete notes
  - Archive important notes
  - Soft deletion with recycle bin
  - Search functionality inside notes
  - Infinite scroll pagination

- **User Profile**
  - Update profile information
  - Change password
  - Delete account with data cleanup

- **UI/UX**
  - Responsive design for all devices
  - Modern animations using Framer Motion
  - Toast notifications
  - Loading states and error handling
  - Dark theme optimized

## Tech Stack

### Frontend
- React + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Framer Motion for animations
- Axios for API requests
- React Router v6
- React Toastify

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Zod for validation
- Node-cron for scheduling tasks

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/notenexus.git
cd notenexus
```

2. Install dependencies

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

3. Environment Setup
   
Create .env files in both client and server directories:

For server (.env):

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GUEST_JWT_SECRET=your_guest_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For client (.env):

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_ENV=development
```

## API Endpoints

#### Auth Routes

-POST `/api/v1/auth/register` - Register new user

-POST `/api/v1/auth/login` - User login

-POST `/api/v1/auth/logout` - User logout

-POST `/api/v1/auth/guest-signin` - Guest sign in

-GET `/api/v1/auth/check-auth` - Verify auth status

#### Notes Routes

GET `/api/v1/notes` - Fetch all notes

POST `/api/v1/notes/addnotes` - Create new note

DELETE `/api/v1/notes/delete/:noteId` - Move note to bin

POST `/api/v1/notes/archive/:noteId` - Archive note


#### Profile Routes

GET `/api/v1/profile/:username` - Get user profile

PUT `/api/v1/profile/edit/:username` - Update profile

PUT `/api/v1/profile/:username/change-password` - Change password

DELETE `/api/v1/profile/:username/delete-profile` - Delete profile

## Deployment

The application is configured for deployment on Vercel:

1. Frontend: Deploy the client directory
2. Backend: Deploy the server directory
3. Set up environment variables in Vercel dashboard
4. Configure build commands and output directories

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Pull Request Message

PRs are welcome. When submitting a PR, please include a clear description of your changes, reference related issues if applicable, and ensure all tests pass. Use concise and informative commit messages.

## Contact

For questions or collaboration, reach out to me on [Twitter/x](https://x.com/_manishmk)
