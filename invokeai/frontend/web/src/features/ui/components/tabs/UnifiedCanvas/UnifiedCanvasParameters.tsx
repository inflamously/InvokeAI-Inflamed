import ParamDynamicPromptsCollapse from 'features/dynamicPrompts/components/ParamDynamicPromptsCollapse';
import ParamLoraCollapse from 'features/lora/components/ParamLoraCollapse';
import ParamAdvancedCollapse from 'features/parameters/components/Parameters/Advanced/ParamAdvancedCollapse';
import ParamCompositingSettingsCollapse from 'features/parameters/components/Parameters/Canvas/Compositing/ParamCompositingSettingsCollapse';
import ParamInfillAndScalingCollapse from 'features/parameters/components/Parameters/Canvas/InfillAndScaling/ParamInfillAndScalingCollapse';
import ParamControlNetCollapse from 'features/parameters/components/Parameters/ControlNet/ParamControlNetCollapse';
import ParamPromptArea from 'features/parameters/components/Parameters/Prompt/ParamPromptArea';
import ParamSymmetryCollapse from 'features/parameters/components/Parameters/Symmetry/ParamSymmetryCollapse';
import { memo } from 'react';
import UnifiedCanvasCoreParameters from './UnifiedCanvasCoreParameters';
import ParamPromptInflameArea from 'features/promptInflame/components/Parameters/PromptInflame/ParamPromptInflameArea';

const UnifiedCanvasParameters = () => {
  return (
    <>
      <ParamPromptInflameArea />
      <ParamPromptArea />
      <UnifiedCanvasCoreParameters />
      <ParamControlNetCollapse />
      <ParamLoraCollapse />
      <ParamDynamicPromptsCollapse />
      <ParamSymmetryCollapse />
      <ParamInfillAndScalingCollapse />
      <ParamCompositingSettingsCollapse />
      <ParamAdvancedCollapse />
    </>
  );
};

export default memo(UnifiedCanvasParameters);
