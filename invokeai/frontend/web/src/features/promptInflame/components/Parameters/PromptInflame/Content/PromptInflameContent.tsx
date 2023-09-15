import { List, ListItem, Divider, Fade } from '@chakra-ui/react';
import { ScrollArea } from '@mantine/core';
import { useChakraThemeTokens } from 'common/hooks/useChakraThemeTokens';
import PromptInflameContentAccordion from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContentAccordion';
import { useAppToaster } from 'app/components/Toaster';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

export type PromptContentViewModel = {
  prompt: {
    key: number;
    positive: string;
    negative: string;
    score: number;
  };
  category: {
    key: number;
    name: string;
  };
};

const PromptInflameContent = (props: {
  prompts: PromptContentViewModel[];
  onApplyPrompt?: (prompt: PromptContentViewModel) => void;
}) => {
  const { prompts, onApplyPrompt } = props;
  const hasPrompts = prompts.length > 0;
  const { baseAlpha300, baseAlpha900, base700 } = useChakraThemeTokens();
  const toast = useAppToaster();
  const { t } = useTranslation();

  const handleDeletePrompt = (prompt: PromptContentViewModel) => {
    console.log('Delete ', prompt);
  };

  const handleUsePrompt = (prompt: PromptContentViewModel) => {
    onApplyPrompt?.(prompt);
    toast({
      title: t('promptInflame.prompt.apply'),
      description: t('promptInflame.prompt.applyDescription'),
    });
  };

  return (
    <ScrollArea
      h={256}
      offsetScrollbars={false}
      scrollbarSize={10}
      type="hover"
    >
      <List>
        {hasPrompts &&
          prompts.map((p, i) => (
            <ListItem
              key={p.prompt.key}
              sx={{
                border: `solid 0.15rem ${baseAlpha300}`,
                borderRadius: 4,
                bgColor: 'base.900',
                _notLast: {
                  marginBottom: 1,
                },
                _hover: {
                  border: `solid 0.15rem ${baseAlpha900}`,
                  bgColor: base700,
                },
              }}
            >
              <AnimatePresence>
                <motion.div
                  key={p.prompt.key}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <PromptInflameContentAccordion
                    prompt={p}
                    onUsePrompt={handleUsePrompt}
                    onDeletePrompt={handleDeletePrompt}
                  />
                </motion.div>
              </AnimatePresence>
              {i < prompts.length - 1 && <Divider />}
            </ListItem>
          ))}
      </List>
    </ScrollArea>
  );
};

export default PromptInflameContent;
