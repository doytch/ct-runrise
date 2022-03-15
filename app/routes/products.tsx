import { useLoaderData } from 'remix';
import ctClient from '~/helpers/ctClient';

export async function loader() {
  const products = await ctClient
    .productProjections()
    .get({ queryArgs: { staged: false } })
    .execute();

  return products.body.results;
}

export default function Products() {
  const products = useLoaderData();

  console.log(products);

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
