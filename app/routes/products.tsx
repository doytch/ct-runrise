import { Link, json, useLoaderData, useSearchParams, MetaFunction } from 'remix';
import type { LoaderFunction } from 'remix';

import { Alert, Pagination, PaginationItem, Stack } from '@mui/material';

import { ProductList } from '~/components/ProductList';
import ctClient from '~/helpers/ctClient';
import { getErrorMessage } from '~/utils';

const PAGE_SIZE = 20;

export const meta: MetaFunction = () => ({ title: 'Products' });

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get('offset') ?? '0';

  const params = ['staged:false', `limit:${PAGE_SIZE}`, `offset:${offset}`];

  const search = url.searchParams.get('search');
  if (search) {
    params.push(`text:"${search}"`);
    params.push('locale:"en"');
  } else {
    params.push('sorts:"name.en asc"');
  }

  let response;

  try {
    response = await ctClient
      .graphql()
      .post({
        body: {
          query: `
            query {
              productProjectionSearch(${params.join(', ')}) {
                offset,
                count,
                total,
                results {
                  id, 
                  key,
                  name(locale:"en"),
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
      .execute();
  } catch (error: any) {
    // I wish I didn't cast this to `any` but I can't figure out a better solution
    // for handling when I _know_ that it's a GraphQL response containing errors.
    let errors = [];
    if (error?.body?.errors) {
      errors = error?.body?.errors.map((e: any) => e.message);
    } else {
      errors.push(`Error fetching products: ${getErrorMessage(error)}`);
    }

    return json({ errors, results: [], offset: 0, count: 0, total: 0 });
  }

  if (response?.body?.data) {
    return json(response.body.data.productProjectionSearch);
  }

  // base case
  return json({ results: [], offset: 0, count: 0, total: 0 });
};

export default function Products() {
  const { errors, results: products, offset, total } = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <>
      {Array.isArray(errors) &&
        errors.map(error => (
          <Alert key={error} severity="error">
            {error}
          </Alert>
        ))}
      <Stack spacing={2}>
        <Pagination
          color="secondary"
          count={Math.ceil(total / PAGE_SIZE)}
          page={Math.floor(offset / PAGE_SIZE) + 1}
          renderItem={item => {
            switch (item.type) {
              case 'page': {
                const destinationPage = (item?.page ?? 1) - 1;
                if (destinationPage) {
                  searchParams.set('offset', String(PAGE_SIZE * destinationPage));
                } else {
                  searchParams.delete('offset');
                }
                break;
              }
              case 'previous':
                searchParams.set('offset', String(offset - PAGE_SIZE));
                break;
              case 'next':
                searchParams.set('offset', String(offset + PAGE_SIZE));
                break;
              default:
            }

            return (
              <PaginationItem
                component={Link}
                prefetch="intent"
                to={`?${searchParams.toString()}`}
                {...item} // eslint-disable-line react/jsx-props-no-spreading
              />
            );
          }}
          style={{
            margin: '16px auto',
          }}
        />
      </Stack>
      <ProductList products={products} />
    </>
  );
}

export function headers() {
  return {
    'cache-control': 'max-age=604800, stale-while-revalidate=86400',
  };
}
