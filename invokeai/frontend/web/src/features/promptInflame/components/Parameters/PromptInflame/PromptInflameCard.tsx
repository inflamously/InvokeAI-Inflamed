import { memo } from 'react';
import {
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  Textarea,
} from '@chakra-ui/react';

const PromptInflameCard = ({
  positivePrompt,
  negativePrompt,
}: {
  positivePrompt?: string;
  negativePrompt?: string;
}) => {
  return (
    <Card>
      <CardBody>
        <Text fontSize="ml">Prompt</Text>
        <Box pt={8}>
          <Text>Positive Prompt</Text>
          <Box pt={2}>
            <Textarea readOnly={true} value={positivePrompt}></Textarea>
          </Box>
        </Box>
        <Box pt={4}>
          <Text>Negative Prompt</Text>
          <Box pt={2}>
            <Textarea readOnly={true} value={negativePrompt}></Textarea>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default PromptInflameCard;
