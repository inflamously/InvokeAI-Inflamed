import ParamDynamicPromptsCollapse from 'features/dynamicPrompts/components/ParamDynamicPromptsCollapse';
import ParamLoraCollapse from 'features/lora/components/ParamLoraCollapse';
import ParamAdvancedCollapse from 'features/parameters/components/Parameters/Advanced/ParamAdvancedCollapse';
import ParamControlNetCollapse from 'features/parameters/components/Parameters/ControlNet/ParamControlNetCollapse';
import ParamSymmetryCollapse from 'features/parameters/components/Parameters/Symmetry/ParamSymmetryCollapse';
import { memo } from 'react';
import ParamPromptArea from '../../../../parameters/components/Parameters/Prompt/ParamPromptArea';
import TextToImageTabCoreParameters from './TextToImageTabCoreParameters';
import ParamPromptInflameArea from 'features/promptInflame/components/Parameters/PromptInflame/ParamPromptInflameArea';

const TextToImageTabParameters = () => {
  return (
    <>
      <ParamPromptInflameArea />
      <ParamPromptArea />
      <TextToImageTabCoreParameters />
      <ParamControlNetCollapse />
      <ParamLoraCollapse />
      <ParamDynamicPromptsCollapse />
      <ParamSymmetryCollapse />
      <ParamAdvancedCollapse />
    </>
  );
};

export default memo(TextToImageTabParameters);
