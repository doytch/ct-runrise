import { json, useLoaderData } from 'remix';
import ctClient from '~/helpers/ctClient';

export async function loader() {
  console.time('/product-projections/search');
  const products = await ctClient
    .productProjections()
    .search()
    .get({
      queryArgs: {
        staged: false,
        markMatchingVariants: false,
      },
    })
    .execute();

  console.timeEnd('/product-projections/search');
  return json(products.body.results);
}

export default function Products() {
  const products = useLoaderData();

  return (
    <>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name.en}</li>
        ))}
      </ul>
    </>
  );
}

export function headers() {
  return {
    'cache-control': 'max-age=604800, stale-while-revalidate=86400',
  };
}
