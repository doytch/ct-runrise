import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <ul>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <a href="https://everest.agency" rel="noreferrer" target="_blank">
            Everest
          </a>
        </li>
        <li>
          <a href="https://remix.run/tutorials/blog" rel="noreferrer" target="_blank">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a href="https://remix.run/tutorials/jokes" rel="noreferrer" target="_blank">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a href="https://remix.run/docs" rel="noreferrer" target="_blank">
            Remix Docs
          </a>
        </li>
        <li>
          <a href="https://docs.commercetools.com/api" rel="noreferrer" target="_blank">
            Commercetools API Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
