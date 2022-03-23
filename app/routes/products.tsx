import { json, useLoaderData, Link } from 'remix';
import type { LoaderFunction } from 'remix';
import ctClient from '~/helpers/ctClient';
import { ProductList } from '~/components/ProductList';
import { getErrorMessage } from '~/utils';
import { Button, Box, Typography } from '@mui/material';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get('offset') ?? '0';

  const response = await ctClient
    .graphql()
    .post({
      body: {
        query: `
        query {
          productProjectionSearch(staged:false, offset:${offset} limit:20, sorts:"name.en asc") {
            offset,
            count,
            total,
            results {
              id, 
              key,
              name(locale: "en"),
              masterVariant {
                images {
                  url
                }
              }
            }  
          }
        }`,
      },
    })
    .execute()
    .catch((error: unknown) => {
      console.error(getErrorMessage(error));
    });

  const data = response.body.data?.productProjectionSearch;

  return json(data);
};

export default function Products({ pathname = '/products' }) {
  const { results: products, offset, count, total } = useLoaderData();

  const urlNext = `${pathname}?offset=${offset + 20}`;
  const urlPrev = `${pathname}?offset=${offset - 20}`;

  return (
    <>
      <Typography variant="h2">Products</Typography>
      <Typography style={{ textAlign: 'center' }} variant="h6">
        Showing {offset} - {offset + count} / {total}
      </Typography>
      <Box style={{ textAlign: 'center' }}>
        <Button
          component={Link}
          disabled={offset === 0}
          prefetch="intent"
          style={{ margin: '0 8px', minWidth: 200 }}
          to={urlPrev}
          type="button"
        >
          Show Previous
        </Button>
        <Button
          component={Link}
          disabled={offset > total - count}
          prefetch="intent"
          style={{ margin: '0 8px', minWidth: 200 }}
          to={urlNext}
          type="button"
        >
          Show Next
        </Button>
      </Box>
      <div>
        <ProductList products={products} />
      </div>
    </>
  );
}

export function headers() {
  return {
    'cache-control': 'max-age=604800, stale-while-revalidate=86400',
  };
}
