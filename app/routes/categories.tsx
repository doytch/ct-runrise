import { json, LoaderFunction } from 'remix';
import { getCategories } from '~/helpers/categories.server';
import ctClient from '~/helpers/ctClient';
import { getErrorMessage } from '~/utils';

export const loader: LoaderFunction = async () => {
  let response = await getCategories();
};
