# Apollo GraphQL SSR Example with Next.js App Router

This document demonstrates how to use `@apollo/experimental-nextjs-app-support` with the Next.js App Router to enable SSR support with a shared `InMemoryCache`.

---

## 1. 🔧 Setup: `ApolloWrapper` (Client Component)

This is your provider — wrap your root layout with it:

```tsx
// lib/apollo/ApolloWrapper.tsx
"use client";

import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";

function makeClient() {
  return new ApolloClient({
    uri: "https://your-graphql-endpoint.com/graphql",
    cache: new InMemoryCache(),
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
```

```tsx
// app/layout.tsx
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
}
```

---

## 2. 🖥️ Server Component: Preload the Query

Use `PreloadQuery` in a **Server Component** to kick off the fetch on the server:

```tsx
// app/users/page.tsx  (Server Component)
import { PreloadQuery } from "@apollo/experimental-nextjs-app-support";
import { gql } from "@apollo/client";
import { Suspense } from "react";
import { UserList } from "@/components/UserList";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export default function UsersPage() {
  return (
    <PreloadQuery query={GET_USERS}>
      <Suspense fallback={<p>Loading users...</p>}>
        <UserList />
      </Suspense>
    </PreloadQuery>
  );
}
```

---

## 3. ⚛️ Client Component: Consume the Data

Use `useSuspenseQuery` in the **Client Component** — it will reuse the preloaded SSR data from the server, no extra network request:

```tsx
// components/UserList.tsx
"use client";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support";
import { gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

type User = {
  id: string;
  name: string;
  email: string;
};

type GetUsersData = {
  users: User[];
};

export function UserList() {
  const { data } = useSuspenseQuery<GetUsersData>(GET_USERS);

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> — {user.email}
        </li>
      ))}
    </ul>
  );
}
```

---

## How it all fits together

| Part               | Type                       | Role                                                                                         |
|--------------------|---------------------------|-----------------------------------------------------------------------------------------------|
| `ApolloWrapper`    | Client Component          | Provides the shared Apollo client + cache                                                    |
| `PreloadQuery`     | Server Component          | Starts the fetch on the server (SSR)                                                         |
| `useSuspenseQuery` | Client Component hook     | Reads from cache; no duplicate fetch                                                          |
| `<Suspense>`       | React built-in            | Handles the loading state during streaming                                                    |

> **Key benefit:** `PreloadQuery` + `useSuspenseQuery` means the data is fetched once on the server, streamed to the client, and seamlessly hydrated into the shared `InMemoryCache` — no waterfall, no duplicate requests.