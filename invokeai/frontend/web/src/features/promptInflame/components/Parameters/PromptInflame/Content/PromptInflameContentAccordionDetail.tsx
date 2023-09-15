import { PromptContentViewModel } from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContent';
import { Box, Flex, Text } from '@chakra-ui/react';
import { memo } from 'react';
import IAIIconButton from 'common/components/IAIIconButton';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const PromptInflameContentAccordionDetail = (props: {
  prompt: PromptContentViewModel;
}) => {
  const { prompt: p } = props;
  const { t } = useTranslation();

  return (
    <>
      <Flex flexDirection="row" justifyContent="space-between" pr={4}>
        <Box>
          <Text fontSize="small">Category</Text>
          <Text pb={2} fontSize={14}>
            {p.category.name}
          </Text>
        </Box>
        <Box>
          <Text fontSize="small">Score</Text>
          <Text pb={2} fontSize={14}>
            {p.prompt.score} Points
          </Text>
        </Box>
      </Flex>

      <Text fontSize="small">Positive</Text>
      <Text pb={2} fontSize={14}>
        {p.prompt.positive}
      </Text>
      <Text fontSize="small">Negative</Text>
      <Text fontSize={14}>{p.prompt.negative}</Text>
    </>
  );
};

export default memo(PromptInflameContentAccordionDetail);
