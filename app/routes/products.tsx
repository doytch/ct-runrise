import { json, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import ctClient from '~/helpers/ctClient';
import ProductList from '~/components/ProductList';
import { getErrorMessage } from '~/utils';
import { Button, Box } from '@mui/material';

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

export default function Products() {
  const { results: products, offset, count, total } = useLoaderData();

  const changeProductOffset = (advance: Boolean) => {
    let path = `${window.location.pathname}?`;
    path += `offset=${advance ? offset + 20 : offset - 20}`;
    window.location.assign(path);
  };

  return (
    <>
      <h1>Products</h1>
      <h3>
        Showing {offset} - {offset + count} / {total}
      </h3>
      <Box style={{ textAlign: 'center' }}>
        <Button
          style={{ margin: '0 8px', minWidth: 200 }}
          type="button"
          disabled={offset === 0}
          onClick={() => changeProductOffset(false)}
        >
          Show Previous
        </Button>
        <Button
          style={{ margin: '0 8px', minWidth: 200 }}
          type="button"
          disabled={offset > total - count}
          onClick={() => changeProductOffset(true)}
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
