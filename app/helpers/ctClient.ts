import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const { CTP_PROJECT_KEY, CTP_CLIENT_SECRET, CTP_CLIENT_ID, CTP_AUTH_URL, CTP_API_URL } =
  process.env;

if (!CTP_PROJECT_KEY) {
  console.error('CTP_PROJECT_KEY not defined! Check everything!');
}

// create the authMiddlewareOptions object
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: CTP_AUTH_URL ?? '',
  projectKey: CTP_PROJECT_KEY ?? '',
  credentials: {
    clientId: CTP_CLIENT_ID ?? '',
    clientSecret: CTP_CLIENT_SECRET ?? '',
  },
  fetch,
};

// create the httpMiddlewareOptions object also
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: CTP_API_URL ?? '',
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export default createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: CTP_PROJECT_KEY ?? '',
});
