# Apollo GraphQL SSR Example with Next.js App Router

This document demonstrates how to use `@apollo/client-integration-nextjs` with the Next.js App Router to enable SSR support with a shared `InMemoryCache`.

> ✅ **Note:** The previously experimental package `@apollo/experimental-nextjs-app-support` has been renamed to the stable `@apollo/client-integration-nextjs`. Update your dependencies accordingly:
> 
> ```sh
> npm install @apollo/client@latest @apollo/client-integration-nextjs
> ```

---

## 1. 🔧 Setup: `ApolloWrapper` (Client Component)

This is your provider — wrap your root layout with it:

```tsx
// lib/apollo/ApolloWrapper.tsx
"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

function makeClient() {
  const httpLink = new HttpLink({
    // This needs to be an absolute URL, as relative URLs cannot be used in SSR
    uri: "https://your-graphql-endpoint.com/graphql",
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
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

Use `PreloadQuery` (exported from your RSC Apollo client setup) in a **Server Component** to kick off the fetch on the server:

```tsx
// lib/apollo/ApolloClient.ts
import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // This needs to be an absolute URL, as relative URLs cannot be used in SSR
      uri: "https://your-graphql-endpoint.com/graphql",
    }),
  });
});
```

```tsx
// app/users/page.tsx (Server Component)
import { gql } from "@apollo/client";
import { Suspense } from "react";
import { PreloadQuery } from "@/lib/apollo/ApolloClient";
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
}
```

---

## 3. ⚛️ Client Component: Consume the Data

Use `useSuspenseQuery` from `@apollo/client` in the **Client Component** — it will reuse the preloaded SSR data from the server, with no extra network request:

```tsx
// components/UserList.tsx
"use client";

import { useSuspenseQuery, gql } from "@apollo/client";

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
}
```

---

## How it all fits together

| Part               | Type                   | Role                                                      |
|--------------------|------------------------|-----------------------------------------------------------|
| `ApolloWrapper`    | Client Component       | Provides the shared Apollo client + cache                 |
| `registerApolloClient` | RSC setup          | Creates a per-request server-side Apollo client           |
| `PreloadQuery`     | Server Component       | Starts the fetch on the server (SSR)                      |
| `useSuspenseQuery` | Client Component hook  | Reads from cache; no duplicate fetch                      |
| `<Suspense>`       | React built-in         | Handles the loading state during streaming                |

> **Key benefit:** `PreloadQuery` + `useSuspenseQuery` means the data is fetched once on the server, streamed to the client, and seamlessly hydrated into the shared `InMemoryCache` — no waterfall, no duplicate requests.

> ❗️ **Important:** RSC and SSR use cases are handled separately. Avoid overlapping queries between the two to prevent data inconsistencies in your UI.