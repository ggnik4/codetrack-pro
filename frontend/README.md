# CodeTrack Pro - Frontend

A production-grade, AI-powered developer platform frontend built with Next.js 15, TypeScript, and modern React patterns.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update API URL if needed
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
├── stores/               # Zustand stores
├── styles/               # Global styles
└── types/                # TypeScript types
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Theme**: next-themes

## 🔐 Authentication

The frontend connects to a Django REST Framework backend with JWT authentication.

### API Endpoints

- `POST /auth/register/` - User registration
- `POST /login/` - User login
- `POST /login/refresh/` - Refresh token
- `GET /auth/me/` - Get current user
- `POST /auth/logout/` - User logout

### Token Management

Tokens are automatically stored and managed via Zustand store. The Axios client automatically adds the Bearer token to all requests.

## 🎨 Design

- **Dark Theme First**: Optimized for dark mode with light mode support
- **Premium UI**: Inspired by GitHub, Linear, Vercel, and Stripe
- **Responsive**: Mobile-first design that scales to desktop
- **Accessible**: WCAG 2.1 AA compliant

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework with App Router |
| `react-hook-form` | Efficient form state management |
| `zod` | TypeScript-first schema validation |
| `zustand` | Lightweight state management |
| `axios` | HTTP client with interceptors |
| `framer-motion` | Smooth animations |
| `recharts` | Data visualization |
| `tailwindcss` | Utility-first CSS |
| `shadcn/ui` | Accessible UI components |

## 🚀 Features

- ✅ User authentication (login, register, password reset)
- ✅ Dashboard with analytics and charts
- ✅ Project management
- ✅ Issue tracking and filtering
- ✅ AI-powered insights
- ✅ User settings and profile management
- ✅ Command palette (Cmd+K)
- ✅ Notification system
- ✅ Dark/Light theme toggle
- ✅ Responsive design

## 📝 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEFAULT_THEME=dark
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

## 🔗 API Configuration

The frontend expects a Django REST Framework backend running at `http://localhost:8000/api/v1`.

Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend.

## 📚 Documentation

See `FRONTEND_ARCHITECTURE.md` for detailed architecture documentation.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions, please open an issue on GitHub or contact the development team.
