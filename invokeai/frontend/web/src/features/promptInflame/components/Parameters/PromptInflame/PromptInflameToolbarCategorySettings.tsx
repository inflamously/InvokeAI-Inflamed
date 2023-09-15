import { ChangeEvent, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChakraThemeTokens } from 'common/hooks/useChakraThemeTokens';
import {
  Box,
  Flex,
  InputGroup,
  InputRightAddon,
  InputRightElement,
} from '@chakra-ui/react';
import IAIInput from 'common/components/IAIInput';
import IAIButton from 'common/components/IAIButton';
import { FaPlus } from 'react-icons/fa';

const PromptInflameToolbarCategorySettings = (props: {
  disabled?: boolean;
  onCreateNewCategory?: (categoryName: string) => void;
}) => {
  const { onCreateNewCategory, disabled } = props;
  const [categoryName, setCategoryName] = useState('');
  const { t } = useTranslation();
  const { base750 } = useChakraThemeTokens();

  const handleCreateNewCategory = () => {
    onCreateNewCategory?.(categoryName);
  };

  const handleSetCategoryName = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev) {
      setCategoryName(ev.target.value);
    }
  };

  return (
    <Box
      p={2}
      pl={4}
      pr={4}
      mb={2}
      sx={{
        borderRadius: 4,
        bgColor: base750,
      }}
    >
      <Flex flexDirection="row" alignItems="center" p={2}>
        <InputGroup>
          <IAIInput
            placeholder={t('Name')}
            value={categoryName}
            onChange={handleSetCategoryName}
          />
          <InputRightElement w={24}>
            <IAIButton
              leftIcon={<FaPlus />}
              size="sm"
              isDisabled={disabled}
              variant="ghost"
              onClick={handleCreateNewCategory}
            >
              Create
            </IAIButton>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Box>
  );
};

export default memo(PromptInflameToolbarCategorySettings);
