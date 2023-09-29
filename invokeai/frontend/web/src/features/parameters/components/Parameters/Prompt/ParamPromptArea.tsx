import { Flex } from '@chakra-ui/react';
import ParamNegativeConditioning from 'features/parameters/components/Parameters/Core/ParamNegativeConditioning';
import ParamPositiveConditioning from 'features/parameters/components/Parameters/Core/ParamPositiveConditioning';
import ParamPromptInflameArea from 'features/promptInflame/components/Parameters/PromptInflame/ParamPromptInflameArea';

export default function ParamPromptArea() {
  return (
    <>
      <ParamPromptInflameArea />
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <ParamPositiveConditioning />
        <ParamNegativeConditioning />
      </Flex>
    </>
  );
}
