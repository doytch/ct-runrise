import {
  Links,
  LoaderFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  LinksFunction,
} from 'remix';
import type { MetaFunction } from 'remix';
import { useLoaderData } from '@remix-run/react';

import { NavBar } from '~/components/NavBar';
import { getCategories } from '~/helpers/categories.server';
import robotoUrl from '~/styles/roboto.css';
import materialIconsUrl from '~/styles/material-icons.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: robotoUrl },
  { rel: 'stylesheet', href: materialIconsUrl },
];

export const meta: MetaFunction = () => ({ title: 'New Remix App' });

export const loader: LoaderFunction = async () => {
  const categories = await getCategories();
  return json({ categories });
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0 }}>
        {children}
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const { categories = [] } = useLoaderData();

  return (
    <Document>
      <NavBar categories={categories} />
      <Outlet />
    </Document>
  );
}
