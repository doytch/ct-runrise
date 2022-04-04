import { getErrorMessage } from '~/utils';
import ctClient from './ctClient';

export async function getCategories() {
  let response;

  try {
    response = await ctClient
      .graphql()
      .post({
        body: {
          query: `
            query {
              categories(sort:"name.en asc", where:"parent is not defined") {
              total
              count
              results {
                name(locale:"en")
                key
                children {
                  name(locale:"en")
                  key
                  children {
                    name(locale:"en")
                    key
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

    return { errors, results: [], offset: 0, count: 0, total: 0 };
  }

  if (response?.body?.data) {
    return response.body.data.categories.results;
  }

  return { results: [], offset: 0, count: 0, total: 0 };
}
