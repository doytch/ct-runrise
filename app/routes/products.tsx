import { Form, Link, json, useLoaderData, useSearchParams, MetaFunction } from 'remix';
import type { LoaderFunction } from 'remix';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

import { ProductList } from '~/components/ProductList';
import ctClient from '~/helpers/ctClient';
import { getErrorMessage } from '~/utils';

export const meta: MetaFunction = () => ({ title: 'Products' });

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get('offset') ?? '0';

  const params = ['staged:false', 'limit:20', `offset:${offset}`];

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
  const { errors, results: products, offset, total, count } = useLoaderData();

  const [searchParams] = useSearchParams();
  searchParams.set('offset', String(offset + 20));
  const urlNext = `?${searchParams.toString()}`;
  searchParams.set('offset', String(offset - 20));
  const urlPrev = `?${searchParams.toString()}`;

  return (
    <>
      {Array.isArray(errors) &&
        errors.map(error => (
          <Alert key={error} severity="error">
            {error}
          </Alert>
        ))}
      <Box style={{ textAlign: 'center' }}>
        <Form method="get">
          <TextField
            defaultValue={searchParams.get('search') ?? undefined}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Search"
            margin="normal"
            name="search"
            type="search"
          />
        </Form>
        <Typography variant="h6">
          Showing {offset} - {offset + count} / {total}
        </Typography>
        <Box>
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
            disabled={offset + 20 > total - count}
            prefetch="intent"
            style={{ margin: '0 8px', minWidth: 200 }}
            to={urlNext}
            type="button"
          >
            Show Next
          </Button>
        </Box>
      </Box>
      <ProductList products={products} />
    </>
  );
}

export function headers() {
  return {
    'cache-control': 'max-age=604800, stale-while-revalidate=86400',
  };
}
