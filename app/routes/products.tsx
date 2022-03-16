import { json, useLoaderData } from 'remix';
import ctClient from '~/helpers/ctClient';

export async function loader() {
  console.time('/product-projections/search');
  const response = await ctClient
    .graphql()
    .post({
      body: {
        query: `
        query {
          productProjectionSearch(staged:false, limit:20, sorts:"name.en asc") {
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
    .catch(error => {
      console.error('Error fetching from Commercetools');
      console.error(error);
    });

  const data = response.body.data?.productProjectionSearch;

  return json(data);
}

export default function Products() {
  const { results: products, offset, count, total } = useLoaderData();

  return (
    <>
      <h1>Products</h1>
      <h3>
        Showing {offset} - {offset + count} / {total}
      </h3>
      <button type="button" disabled={offset !== 0}>
        Show Previous
      </button>
      <button type="button" disabled={offset < count - offset}>
        Show Next
      </button>
      <div>
        {products.map(product => (
          <div key={product.id}>
            <div>{product.name}</div>
            <img src={product.masterVariant?.images?.[0]?.url} width={200} alt="" />
          </div>
        ))}
      </div>
    </>
  );
}

export function headers() {
  return {
    'cache-control': 'max-age=604800, stale-while-revalidate=86400',
  };
}
