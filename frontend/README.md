# Frontend README
# College Project Repository System

A modern, full-featured web application for managing college project submissions. Built with React 18, Vite, TypeScript, and Tailwind CSS.

![Project Screenshot](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop)

## ✨ Features

### 🎓 Student Module
- **Dashboard** - View project statistics, recent uploads, and activity
- **Upload Project** - Submit projects with drag-and-drop file uploads
- **Browse Projects** - Search, filter, and explore all projects
- **Project Details** - View full project information with image gallery

### 👨‍🏫 Faculty Module
- **Review Dashboard** - Review pending project submissions
- **Approve/Reject** - Approve or reject projects with comments
- **Project Review Page** - Detailed view with all files and student info

### 🔐 Admin Module
- **Admin Dashboard** - System overview with user and project statistics
- **Manage Users** - View, edit, and delete users
- **Manage Projects** - Full project management capabilities

### 🔑 Authentication
- JWT-based authentication
- Role-based access control (Student, Faculty, Admin)
- Protected routes
- Persistent sessions

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── icons/          # Custom icon components
│   ├── shared/         # Shared components (DataTable, Avatar, etc.)
│   └── student/        # Student-specific components
├── context/            # React Context providers
├── data/               # Mock data for development
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── admin/          # Admin module pages
│   ├── faculty/        # Faculty module pages
│   └── student/        # Student module pages
├── routes/             # Router configuration
├── services/           # API service layer
└── utils/              # Utility functions and constants
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd college-project-repo
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@college.edu | password123 |
| Faculty | faculty@college.edu | password123 |


## 🔌 Backend API

This frontend is designed to work with a FastAPI backend. Expected endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Projects
- `GET /projects` - List all projects (with filters)
- `GET /projects/{id}` - Get single project
- `POST /projects` - Create new project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Faculty
- `GET /faculty/pending` - Get pending projects
- `PUT /faculty/approve/{id}` - Approve project
- `PUT /faculty/reject/{id}` - Reject project


## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices
- 📟 Tablets
- 💻 Desktop computers

## 🎨 UI/UX Features

- Modern, clean design inspired by GitHub/Vercel
- Smooth animations and transitions
- Loading skeletons for better UX
- Toast notifications for feedback
- Modal dialogs for confirmations
- Drag-and-drop file uploads
- Dark/light color scheme support (coming soon)

## 📄 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Application name | `ProjectRepo` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "react-hook-form": "^7.x",
  "lucide-react": "^0.x",
  "react-hot-toast": "^2.x",
  "tailwindcss": "^4.x"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Unsplash](https://unsplash.com/) for demo images
