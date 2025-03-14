# Custom Onboarding Flow

A modern, configurable user onboarding application with customizable form components and admin controls.

## Overview

This application provides a complete solution for user onboarding with a wizard-style interface. The admin can customize which components appear on each page of the onboarding flow, allowing for A/B testing and flexible data collection.

## Features

- **Wizard-style onboarding flow** with progress tracking
- **Customizable component placement** via admin interface
- **Real-time data updates** and persistence
- **Modern glassmorphism UI** with responsive design
- **Form validation** with detailed error feedback

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: React Query
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom email/password with bcrypt

## Project Structure

```
├── app/
│   ├── admin/           # Admin configuration interface
│   ├── api/             # API routes
│   │   ├── config/      # Configuration endpoints
│   │   ├── register/    # User registration
│   │   └── users/       # User data management
│   ├── components/      # React components
│   │   ├── FormComponents.tsx  # Reusable form components
│   │   ├── DataTable.tsx       # User data display
│   │   ├── WizardForm.tsx      # Main onboarding container
│   │   └── ...
│   └── data/            # Data visualization page
├── lib/                 # Utilities and shared code
│   ├── api.ts           # API helpers
│   └── prisma.ts        # Database connection
└── prisma/              # Database schema
    ├── schema.prisma    # Prisma schema
    └── migrations/      # Database migrations
```

## Core Components

- **WizardForm**: Controls the multi-step flow and progress tracking
- **FormComponents**: Modular components for data collection (AboutMe, Address, Birthdate)
- **DataTable**: Displays submitted user data with real-time updates
- **Admin**: Interface for customizing which components appear on which pages

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Set up your PostgreSQL database and update the `.env` file with your connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/onboarding"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   yarn run dev
   ```
6. Access the application at http://localhost:3000

## Admin Configuration

Access the admin panel at `/admin` to configure which components appear on which onboarding pages:

- Each page must have at least one component
- Components can be assigned to either Page 2 or Page 3 of the flow
- Changes take effect immediately for new users

## Development Notes

- The application uses cookies to track user progress through the onboarding flow
- Real-time updates in the data table use a polling strategy with React Query
- Form validation uses Zod schemas for type-safe validation

## License

MIT
