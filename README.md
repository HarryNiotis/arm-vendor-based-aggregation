# ARM Vendor-Based Aggregation

A modern web application for aggregating and managing ARM vendor boards and devices. This application provides a user-friendly interface to browse, filter, and organize hardware information from various ARM vendors.

## Overview

This project is built with modern web technologies and best practices:

### Core Technologies

- **[Next.js 16](https://nextjs.org/)** - Latest version of Next/js with Turbopack
- **[TypeScript](https://www.typescriptlang.org/)** - Fully typed codebase for better development experience and fewer runtime errors
- **[Apollo Client 4](https://www.apollographql.com/docs/react/)** - GraphQL client for data fetching with caching
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework for responsive design
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components built on Radix UI and Tailwind CSS

### Development Tools

- **ESLint** - Code quality and style enforcement
- **Prettier** - Code formatting
- **PostCSS** - CSS preprocessing with Tailwind

## Installation

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: Package manager

### Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd arm-vendor-based-aggregation
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# GraphQL API endpoint
NEXT_PUBLIC_GRAPHQL_URI=<your-graphql-api-url>
```

Replace `<your-graphql-api-url>` with your GraphQL API endpoint (e.g., `https://api.example.com/graphql`).

### Development Server

Start the development server with Turbopack:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application for production:

```bash
npm run build
```

### Running the Production Build

Start the production server:

```bash
npm start
```

### Additional Commands

- **Lint code:**

  ```bash
  npm run lint
  ```

- **Format code with Prettier:**

  ```bash
  npm run format
  ```

- **Type check without emitting:**
  ```bash
  npm run typecheck
  ```

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── queries/                 # GraphQL queries
│   │   └── boards.ts            # Board-related queries
│   └── _components/             # App components
│       ├── Boards.tsx
│       ├── Filters.tsx
│       └── Results.tsx
├── api/                          # API configuration
│   ├── ApolloClient.ts          # Apollo Client setup
│   └── ApolloWrapper.tsx        # Apollo provider wrapper
├── components/                   # Reusable components
│   ├── theme-provider.tsx       # Theme provider
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── utils.ts                 # Utility functions
└── public/                       # Static assets
```

## Features

- **Board Data Management** - View and filter ARM vendor boards
- **Device Information** - Browse devices associated with each board
- **Dark Mode Support** - Theme switching with next-themes
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Type-Safe GraphQL** - Type-safe queries with Apollo Client and TypeScript

## Getting Help

For more information:

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
