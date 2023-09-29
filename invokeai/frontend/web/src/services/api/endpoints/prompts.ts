import { api } from 'services/api';
import { QueryDTO } from 'services/api/types';

export interface PromptDTO {
  prompt_key: number;
  category_key: number;
  category_name: string;
  positive_prompt: string;
  negative_prompt: string;
  score: number;
}

export type PromptStoreDTO = Omit<PromptDTO, 'prompt_key' | 'category_name'>;

export type PromptQueryDTO = Partial<{
  prompt_key: number;
  category_key: number;
  category_name: string;
  positive_prompt: string;
  negative_prompt: string;
  score: number;
}> &
  QueryDTO;

export const promptApi = api.injectEndpoints({
  endpoints: (build) => ({
    getExamplePrompt: build.query<PromptDTO, void>({
      query: () => 'prompts/example',
    }),
    getPrompts: build.query<PromptDTO[], PromptQueryDTO>({
      query: ({
        prompt_key,
        category_name,
        positive_prompt,
        negative_prompt,
        score,
        page,
        page_size,
      }) => {
        let endpointQuery = `prompts?prompt_key=${prompt_key}&page=${page}&page_size=${page_size}`;

        if (category_name) {
          endpointQuery += `&category_name=${category_name}`;
        }

        if (positive_prompt) {
          endpointQuery += `&positive_prompt=${positive_prompt}`;
        }

        if (negative_prompt) {
          endpointQuery += `&negative_prompt=${negative_prompt}`;
        }

        if (score) {
          endpointQuery += `&score=${score}`;
        }

        return endpointQuery;
      },
    }),
    storePrompt: build.mutation<void, PromptStoreDTO>({
      query: (prompt) => ({
        url: `/prompts`,
        method: 'POST',
        body: prompt,
      }),
    }),
    deletePrompt: build.mutation<void, number>({
      query: (prompt_key) => ({
        url: `/prompts/${prompt_key}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetExamplePromptQuery,
  useGetPromptsQuery,
  useStorePromptMutation,
  useDeletePromptMutation,
} = promptApi;
