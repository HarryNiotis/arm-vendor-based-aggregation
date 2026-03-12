import { ApolloNextAppProvider, makeClient } from 'apollo-next-app';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client';

const client = makeClient({
  link: new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_URI }),
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }) => {
  return <ApolloNextAppProvider client={client}>{children}</ApolloNextAppProvider>;
};

export default ApolloWrapper;
