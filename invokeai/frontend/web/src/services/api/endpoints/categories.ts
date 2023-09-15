import { api } from 'services/api';

export interface CategoryDTO {
  category_key: number;
  name: string;
}

export type CategoryStoreDTO = {
  name: CategoryDTO['name'];
};

export const promptApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<CategoryDTO[], [number, number]>({
      query: ([category_key, page_size] = [0, 10]) =>
        `categories?category_key=${category_key}&page_size=${page_size}`,
    }),
    getCategoryByName: build.query<CategoryDTO[], string>({
      query: (categoryName) => `categories?name=${categoryName}`,
    }),
    storeCategory: build.mutation<void, CategoryStoreDTO>({
      query: (category) => ({
        url: `/categories`,
        method: 'POST',
        body: category,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useLazyGetCategoryByNameQuery,
  useStoreCategoryMutation,
} = promptApi;
