import { HttpLink } from "@apollo/client"
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs"

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ resultCaching: true }),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
      // the following enforces that we cache the result of each query, and then serve subsequent requests for the same query from cache, without making additional network requests
      fetchOptions: {
        next: {
          revalidate: 300, // revalidate every 5 minutes
        }
      },
    }),
  })
})
