import {
  Links,
  LoaderFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
} from 'remix';
import type { MetaFunction } from 'remix';

import { NavBar } from '~/components/NavBar';
import { getCategories } from '~/helpers/categories.server';
import { useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => ({ title: 'New Remix App' });

export const loader: LoaderFunction = async () => {
  const categories = await getCategories();
  return json({ categories });
};

export default function App() {
  const { categories = [] } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body style={{ margin: 0 }}>
        <NavBar categories={categories} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
