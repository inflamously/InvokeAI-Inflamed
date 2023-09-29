import {
  List,
  ListItem,
  Divider,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Flex,
  Text,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { ScrollArea } from '@mantine/core';
import { useChakraThemeTokens } from 'common/hooks/useChakraThemeTokens';
import PromptInflameContentAccordion from 'features/promptInflame/components/Parameters/PromptInflame/Content/PromptInflameContentAccordion';
import { useAppToaster } from 'app/components/Toaster';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import IAIButton from 'common/components/IAIButton';
import { useRef, useState } from 'react';
import { useDeletePromptMutation } from 'services/api/endpoints/prompts';

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
  onPromptDelete?: () => void;
}) => {
  const { prompts, onApplyPrompt, onPromptDelete } = props;
  const hasPrompts = prompts.length > 0;
  const { baseAlpha300, baseAlpha900, base700 } = useChakraThemeTokens();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [promptToBeDeleted, setPromptToBeDeleted] =
    useState<PromptContentViewModel | null>(null);
  const [deletePrompt] = useDeletePromptMutation();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useAppToaster();
  const { t } = useTranslation();

  const handleDeletePrompt = (prompt: PromptContentViewModel) => {
    if (!prompt) {
      return;
    }

    setPromptToBeDeleted(prompt);
    onToggle?.();
  };

  const handleUsePrompt = (prompt: PromptContentViewModel) => {
    onApplyPrompt?.(prompt);
    toast({
      title: t('promptInflame.prompt.apply'),
      description: t('promptInflame.prompt.applyDescription'),
    });
  };

  const handleAlertClose = () => {
    onClose?.();
  };

  const handleDeleteConfirmation = async () => {
    if (!promptToBeDeleted) {
      toast({
        title: t('# Prompt Delete'),
        description: t('# Prompt Delete Error'),
      });

      return;
    }

    await deletePrompt(promptToBeDeleted?.prompt.key);

    toast({
      title: t('# Prompt Delete'),
      description: t('# Prompt Delete Success'),
    });

    onPromptDelete?.();

    onClose?.();
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
      <AlertDialog
        isOpen={isOpen}
        onClose={handleAlertClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('# Delete Prompt')}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Flex direction="column" gap={3}>
                <Text>{t('common.areYouSure')}</Text>
              </Flex>
            </AlertDialogBody>
            <AlertDialogFooter>
              <IAIButton onClick={handleAlertClose}>Cancel</IAIButton>
              <IAIButton
                colorScheme="error"
                onClick={async () => await handleDeleteConfirmation()}
                ml={3}
              >
                Delete
              </IAIButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ScrollArea>
  );
};

export default PromptInflameContent;
