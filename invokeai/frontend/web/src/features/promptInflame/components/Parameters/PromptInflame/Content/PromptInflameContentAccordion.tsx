import { Box, Collapse, Flex, useDisclosure } from '@chakra-ui/react';
import { PromptContentViewModel } from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContent';
import { useRef } from 'react';
import IAIIconButton from 'common/components/IAIIconButton';
import { FaChevronDown, FaChevronRight, FaFile, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import PromptInflameContentAccordionDetail from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContentAccordionDetail';
import PromptInflameContentAccordionMini from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContentAccordionMini';
import debounce from 'lodash-es/debounce';

const PromptInflameContentAccordion = (props: {
  prompt: PromptContentViewModel;
  onSelectPrompt?: (
    viewElement: HTMLDivElement | null,
    prompt: PromptContentViewModel,
    selected: boolean
  ) => void;
  onUsePrompt?: (prompt: PromptContentViewModel) => void;
  onDeletePrompt?: (prompt: PromptContentViewModel) => void;
}) => {
  const { prompt: p, onSelectPrompt, onUsePrompt, onDeletePrompt } = props;
  const { isOpen, onToggle } = useDisclosure();
  const { t } = useTranslation();
  const viewElement = useRef<HTMLDivElement>(null);

  const toggleDetailedState = () => {
    onToggle();
    onSelectPrompt?.(viewElement.current, p, isOpen);
  };

  const handleUsePrompt = () => onUsePrompt?.(p);
  const handleDeletePrompt = () => onDeletePrompt?.(p);

  return (
    <Flex p={2} alignItems="center">
      <Box ref={viewElement} overflow="hidden" w="100%">
        {
          // TODO: Do we want this? Instant double click freaks out the component and hides it
        }
        <Collapse in={isOpen}>
          <PromptInflameContentAccordionDetail prompt={p} />
        </Collapse>
        <Collapse in={!isOpen}>
          <PromptInflameContentAccordionMini prompt={p} />
        </Collapse>
      </Box>
      <Flex w={16} alignSelf="start" flexWrap="wrap">
        <IAIIconButton
          onClick={toggleDetailedState}
          tooltip={t('')}
          aria-label={t('')}
          icon={isOpen ? <FaChevronDown /> : <FaChevronRight />}
          size="xs"
          variant="ghost"
        ></IAIIconButton>
        <IAIIconButton
          onClick={handleUsePrompt}
          tooltip={t('# Use Prompt')}
          aria-label={t('')}
          icon={<FaFile />}
          size="xs"
          variant="ghost"
        ></IAIIconButton>
        {isOpen && (
          <Box pl={6}>
            <IAIIconButton
              onClick={handleDeletePrompt}
              tooltip={t('# Delete')}
              aria-label={t('')}
              icon={<FaTrash />}
              size="xs"
              variant="ghost"
            ></IAIIconButton>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default PromptInflameContentAccordion;
