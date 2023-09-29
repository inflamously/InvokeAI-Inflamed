import { memo, useEffect, useState } from 'react';
import { Flex, Box, Spinner, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  PromptDTO,
  PromptStoreDTO,
  useGetPromptsQuery,
  useStorePromptMutation,
} from 'services/api/endpoints/prompts';
import IAICollapse from 'common/components/IAICollapse';
import IAIIconButton from 'common/components/IAIIconButton';
import { FaArrowLeft, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import { createSelector } from '@reduxjs/toolkit';
import { isEqual } from 'lodash-es';
import { stateSelector } from 'app/store/store';
import { generationSelector } from 'features/parameters/store/generationSelectors';
import PromptInflameToolbar, {
  CategoryViewModel,
  DEFAULT_CATEGORY,
} from 'features/promptInflame/components/Parameters/PromptInflame/PromptInflameToolbar';
import PromptInflameContent, {
  PromptContentViewModel,
} from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContent';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import {
  GenerationState,
  setNegativePrompt,
  setPositivePrompt,
} from 'features/parameters/store/generationSlice';
import { useAppToaster } from 'app/components/Toaster';
import debounce from 'lodash-es/debounce';

const promptSelector = createSelector(
  [stateSelector, generationSelector],
  (_, generation) => {
    return generation;
  },
  {
    memoizeOptions: isEqual,
  }
);

export const createPromptStoreDTO = (
  generation: GenerationState,
  categoryKey: number,
  score: number = 0
): PromptStoreDTO => {
  const { positivePrompt, negativePrompt } = generation;

  return {
    category_key: categoryKey,
    positive_prompt: positivePrompt,
    negative_prompt: negativePrompt,
    score,
  };
};

const ParamPromptInflameArea = (_: unknown) => {
  const generationState = useAppSelector(promptSelector);
  const dispatch = useAppDispatch();

  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const [promptKey] = useState(0);
  const [category, setCategory] = useState<CategoryViewModel>(DEFAULT_CATEGORY);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const {
    data,
    refetch: refetchPrompts,
    isFetching: isFetchingPrompts,
  } = useGetPromptsQuery({
    page,
    prompt_key: promptKey,
    page_size: pageSize,
    category_name: category.name,
  });
  const [storePrompt] = useStorePromptMutation();
  const toast = useAppToaster();
  const prompts: PromptContentViewModel[] | undefined =
    data?.map((item: PromptDTO) => {
      return {
        prompt: {
          key: item.prompt_key,
          positive: item.positive_prompt,
          negative: item.negative_prompt,
          score: item.score,
        },
        category: {
          key: item.category_key,
          name: item.category_name,
        },
      };
    }) ?? [];
  const { t } = useTranslation();
  const hasPrevItems = page - 1 > -1;
  const hasNextItems = prompts?.length == pageSize;

  // Sync with prompt query
  const handleAddPromptSelectDebounced = debounce(async () => {
    storePrompt(createPromptStoreDTO(generationState, category.key))
      .unwrap()
      .then(async () => {
        toast({
          title: t('promptInflame.prompt.add'),
          description: t('promptInflame.prompt.addDescriptionSuccess'),
        });

        await refetchPrompts();
      })
      .catch(({ data }) => {
        if (data) {
          const { detail } = data as { detail: string };
          if (!detail) {
            return;
          }

          toast({
            title: t('promptInflame.prompt.add'),
            description: detail,
            status: 'error',
          });
        }
      });
  }, 250);
  const handleNavigateBack = () => {
    if (hasPrevItems) {
      setPage(Math.max(page - 1, 0));
    }
  };
  const handleNavigateForward = () => {
    if (hasNextItems) {
      setPage(page + 1);
    }
  };
  const handleApplyPrompt = (prompt: PromptContentViewModel) => {
    dispatch(setPositivePrompt(prompt.prompt.positive));
    dispatch(setNegativePrompt(prompt.prompt.negative));
  };
  const handleCategorySet = (category: CategoryViewModel) => {
    if (category) {
      setCategory(category);
      setPage(0);
    }
  };

  const handlePromptDelete = async () => {
    await refetchPrompts();
  };

  return (
    <IAICollapse
      label={
        <>
          {t('promptInflame.promptPanel')}
          <Box>
            {isComponentLoading || (isFetchingPrompts && <Spinner size="xs" />)}
          </Box>
        </>
      }
    >
      <PromptInflameToolbar
        preselectedCategory={category}
        onCategorySelect={handleCategorySet}
      />
      <Box mb={4}>
        <PromptInflameContent
          prompts={prompts}
          onApplyPrompt={handleApplyPrompt}
          onPromptDelete={async () => await handlePromptDelete()}
        />
      </Box>
      <Flex
        sx={{
          pb: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <IAIIconButton
          tooltip={t('')}
          aria-label={t('')}
          icon={<FaArrowLeft />}
          size="sm"
          isDisabled={!hasPrevItems}
          onClick={handleNavigateBack}
        ></IAIIconButton>
        <Button
          aria-label={t('')}
          size="sm"
          isDisabled={isComponentLoading}
          leftIcon={<FaArrowUp />}
          onClick={async () => {
            setIsComponentLoading(true);
            await handleAddPromptSelectDebounced();
            setIsComponentLoading(false);
          }}
        >
          Insert Prompt
        </Button>
        <IAIIconButton
          tooltip={t('')}
          aria-label={t('')}
          icon={<FaArrowRight />}
          size="sm"
          isDisabled={!hasNextItems}
          onClick={handleNavigateForward}
        ></IAIIconButton>
      </Flex>
    </IAICollapse>
  );
};

export default memo(ParamPromptInflameArea);
