# Vendor-Based Aggregation

A Next.js web application for aggregating arm vendors, boards and devices. It provides a user-friendly basic hierarchical interface to browse and filter the available information from various vendors.

## Challenge Overview

The challenge stated that I should spend up to 3 hours, but I ended up spending some more. Reason being that I had the time available and also wanted to see how far I can take it before deciding I should stop and submit it.

My plan to complete in the challenge time window was:

- Bootstrap a Next.js application with Tailwind CSS and shadcn. This is tooling that I have worked recently and provide excellent CLIs to move fast
- Appreciate the data, think about the UX and create a basic hierarchical UI. I inspected the responses of the GraphQL service and created some mocks to help me scaffold the UI. I took inspiration from https://www.keil.arm.com/devices/ for how it should look
- Wire up the GraphQL API with the dataset as described in the challenge. Then wire it up to the UI, replacing the mocks

I achieved all of the above in the 3 hour window, so I could submit the application at that point. This had the full dataset available but no filtering. Since I had the time available I decided to add the filtering and tidy up the UI a bit more.

So the follow up part of the plan was

- Try to leverage the Apollo GraphQL caching
- Use URL state management to drive the filters
- Add some basic tests for the components I created

I introduced a name and vendor search. The user can search for a board/ device partial name and optionally select a vendor.
I then initiate create the request url based on the selections. The parameters are then handled on the server to filter the dataset and return it back. The filters on the UI are also persisted based on the url parameters.
This allows for browser navigation, leveraging the browser cache, bookmarks but, more importantly, enables the app for future API extensibility.

### Further improvements

A number of improvements could follow given time

- Fetching of all the data at load is inefficient and relies on caching. There is expensive filtering logic in the server that happens on each request, regardless of caching. Having inspected the GraphQL endpoints, we could switch to using operations like `searchBoards` and `searchDevices` to optimize filtering. Since we have URL state management, it is a question of handling the search parameters accordingly
- The UI is built with a combination of Accordion and Collapsible components from shadcn. It does not support any pagination and navigation can be a bit tricky. Ideally this should be replaced with a proper headless table like TanStack table that can support a number of scenarios and UI variants.
- You can only select one vendor. This can be extended to allow multiple selections and leverage the URL parameters accordingly
- Boards with no devices are visible, this can be improved
- There is only one root route in the app. Ideally we would break some of the logic in more routes, so we can also support board and device overviews.
- There are some tests, written quickly with the help of Copilot, but ideally we would need a more comprehensive suite

### Core Technologies

- **[Next.js 16](https://nextjs.org/)** - Latest version of Next.js with Turbopack and TypeScript
- **[Apollo Client 4](https://www.apollographql.com/docs/react/)** - GraphQL client for data fetching with caching
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework for responsive design
- **[shadcn ui](https://ui.shadcn.com/)** - Popular React components built on Radix UI and Tailwind CSS

### Development Tools

- **ESLint** - Code quality and style enforcement
- **Prettier** - Code formatting
- **shadcn CLI** - Quickly bootstrap the app with a style preset and allows quick adding of shadcn components when needed (https://ui.shadcn.com/docs/cli)
- **Copilot** - Added GraphQL and shadcn skills to help scaffold the UI and develop more efficiently; also used for writing tests

## Installation

### Prerequisites

- **Node.js**: v20 or higher

### Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration**

   Create a `.env.local` file in the root directory with the following variables:

   ```bash
   # GraphQL API endpoint
   NEXT_PUBLIC_GRAPHQL_URI=<your-graphql-api-url>
   ```

   Replace `<your-graphql-api-url>` with your GraphQL API endpoint (e.g., `https://api.example.com/graphql`).

3. **Build and run for production:**

   Build the application:

   ```bash
   npm run build
   ```

   Start the production server:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

4. **(Optional) Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

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
│       ├── Results.tsx
│       └── __tests__/           # Component tests
│           ├── Boards.test.tsx
│           ├── Filters.test.tsx
│           └── Results.test.tsx
├── api/                          # API configuration
│   ├── ApolloClient.ts          # Apollo Client setup
│   └── ApolloWrapper.tsx        # Apollo provider wrapper
├── components/                   # Reusable components
│   ├── theme-provider.tsx       # Theme provider
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── utils.ts                 # Utility functions
├── public/                       # Static assets
├── vitest.config.ts             # Vitest configuration
├── vitest.setup.ts              # Vitest setup file
└── package.json                 # Project dependencies and scripts
```

## Getting Help

For more information:

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
