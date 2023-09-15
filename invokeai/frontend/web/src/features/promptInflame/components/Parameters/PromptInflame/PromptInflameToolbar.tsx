import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetCategoriesQuery,
  useStoreCategoryMutation,
} from 'services/api/endpoints/categories';
import { SelectItem, Select } from '@mantine/core';
import { useMantineSelectStyles } from 'mantine-theme/hooks/useMantineSelectStyles';
import IAIIconButton from 'common/components/IAIIconButton';
import { Box, Spinner, Tooltip } from '@chakra-ui/react';
import { FaGear } from 'react-icons/fa6';
import { FaMinus, FaTrash } from 'react-icons/fa';
import { useToggle } from 'react-use';
import PromptInflameToolbarCategorySettings from 'features/promptInflame/components/Parameters/PromptInflame/PromptInflameToolbarCategorySettings';
import debounce from 'lodash-es/debounce';
import { useAppToaster } from 'app/components/Toaster';
import { SpinnerIcon } from '@chakra-ui/icons';

export type CategoryViewModel = {
  key: number;
  name?: string;
};

/*
 * This is the default starting category
 */
export const DEFAULT_CATEGORY: CategoryViewModel = {
  key: 1,
  name: 'unassigned',
};

/**
 * This category allows us to bypass category_name filter and shows all prompts
 */
export const EMPTY_CATEGORY = {
  key: -1,
};

const PromptInflameToolbar = (props: {
  preselectedCategory: CategoryViewModel;
  onCategorySelect: (category: CategoryViewModel) => void;
}) => {
  const { preselectedCategory, onCategorySelect } = props;
  const [categoryName, setCategoryName] = useState('');
  const [categoryKey] = useState(0);
  const [pageSize] = useState(9999);
  const { data, refetch: refetchCategories } = useGetCategoriesQuery([
    categoryKey,
    pageSize,
  ]);
  const [storeCategory] = useStoreCategoryMutation();
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const { t } = useTranslation();
  const [toggleCategorySettings, setToggleCategorySettings] = useToggle(false);
  const toast = useAppToaster();

  let categories: ReadonlyArray<string | SelectItem> = [];
  if (data) {
    categories = [...data].map((c) => {
      return {
        value: c.category_key.toString(),
        label: c.name,
      };
    });
  }

  const handleCategorySelect = (search: string) => {
    if (search === categoryName) {
      return;
    }

    const category = categories.find((c) => {
      const isSelectItem = (obj: unknown): obj is SelectItem =>
        obj !== null &&
        typeof obj === 'object' &&
        'value' in obj &&
        'label' in obj;

      if (isSelectItem(c)) {
        return c.value === search;
      }

      return false;
    }) as SelectItem;

    setCategoryName(category ? search : '');
    onCategorySelect?.(
      category
        ? {
            key: Number.parseInt(category.value, 10),
            name: category.label,
          }
        : EMPTY_CATEGORY
    );
  };

  const handleToggleCategorySettings = () => {
    setToggleCategorySettings?.(!toggleCategorySettings);
  };

  const handleCreateCategory = debounce(async (categoryName: string) => {
    if (!categoryName || categoryName.length <= 0 || categoryName === '') {
      toast({
        title: t('# Category Error'),
        description: t('# Category cannot add'),
        status: 'error',
      });
      return;
    }

    storeCategory({
      name: categoryName,
    })
      .unwrap()
      .then(async () => {
        toast({
          title: t('# Category add'),
          description: t('# Category successfully added'),
        });

        await refetchCategories();
      })
      .catch(({ data }) => {
        if (data) {
          const { detail } = data as { detail: string };

          if (!detail) {
            return;
          }

          toast({
            title: t('# Category add'),
            description: detail,
          });
        }
      });
  }, 500);

  return (
    <Box>
      <Select
        pb={4}
        placeholder={t('promptInflame.toolbar.categoryPlaceholder')}
        data={categories}
        searchable
        defaultValue={preselectedCategory.key.toString()}
        allowDeselect={true}
        onChange={handleCategorySelect}
        rightSection={
          <>
            <Tooltip label={t('#Delete Category')}>
              <IAIIconButton
                tooltip={t('')}
                aria-label={t('')}
                icon={<FaTrash />}
                size="xs"
                variant="ghost"
              ></IAIIconButton>
            </Tooltip>
            <Tooltip label={t('#Category Settings')}>
              <IAIIconButton
                tooltip={t('')}
                aria-label={t('')}
                icon={<FaGear />}
                size="xs"
                variant="ghost"
                onClick={handleToggleCategorySettings}
                mr={12}
              ></IAIIconButton>
            </Tooltip>
          </>
        }
        styles={useMantineSelectStyles()}
      ></Select>
      {toggleCategorySettings && (
        <PromptInflameToolbarCategorySettings
          disabled={isComponentLoading}
          onCreateNewCategory={async (categoryName) => {
            setIsComponentLoading(true);
            await handleCreateCategory(categoryName);
            setIsComponentLoading(false);
          }}
        />
      )}
    </Box>
  );
};

export default PromptInflameToolbar;
