import { DEV_BASE_URL } from "@/config";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";

type ApolloAppProviderType = {
  children: ReactNode;
};

const client = new ApolloClient({
  uri: `${DEV_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

const ApolloAppProvider = ({ children }: ApolloAppProviderType) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloAppProvider;
