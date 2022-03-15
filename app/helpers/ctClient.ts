import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createApiBuilderFromCtpClient } from '@commercetools/typescript-sdk';
import { config } from 'dotenv';

config();

// reference API client credentials from environment variables
const { CTP_PROJECT_KEY, CTP_CLIENT_SECRET, CTP_CLIENT_ID, CTP_AUTH_URL, CTP_API_URL, CTP_SCOPES } =
  process.env;

if (!CTP_PROJECT_KEY) {
  console.error('CTP_PROJECT_KEY not defined! Check everything!');
}

const projectKey = CTP_PROJECT_KEY ?? '';

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: CTP_AUTH_URL,
  projectKey,
  credentials: {
    clientId: CTP_CLIENT_ID,
    clientSecret: CTP_CLIENT_SECRET,
  },
  scopes: [CTP_SCOPES],
  fetch,
});
const httpMiddleware = createHttpMiddleware({
  host: CTP_API_URL,
  fetch,
});
const client = createClient({
  middlewares: [authMiddleware, httpMiddleware],
});

// Create an API root from API builder of commercetools platform client
const apiRoot = createApiBuilderFromCtpClient(client);

export default apiRoot.withProjectKey({ projectKey });
