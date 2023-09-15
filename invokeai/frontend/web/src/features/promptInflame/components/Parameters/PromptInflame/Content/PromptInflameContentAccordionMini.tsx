import { PromptContentViewModel } from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContent';
import { Text, Tooltip } from '@chakra-ui/react';
import { memo } from 'react';

const PromptInflameContentAccordionMini = (props: {
  prompt: PromptContentViewModel;
}) => {
  const { prompt: p } = props;
  return (
    <>
      <Tooltip
        label={p.prompt.positive}
        placement="bottom-start"
        hasArrow
        openDelay={500}
      >
        <Text noOfLines={2} fontSize={14}>
          {p.prompt.positive}
        </Text>
      </Tooltip>
      <Tooltip
        label={p.prompt.negative}
        placement="bottom-start"
        hasArrow
        openDelay={500}
      >
        <Text noOfLines={2} fontSize={14}>
          {p.prompt.negative}
        </Text>
      </Tooltip>
    </>
  );
};

export default memo(PromptInflameContentAccordionMini);
