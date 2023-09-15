from logging import Logger
from typing import List

from invokeai.app.services.entity import EntityServiceABC, EntityExampleABC
from invokeai.app.services.models.prompt_record import PromptRecord, PromptQuery
from invokeai.app.services.prompts_storage import PromptsStorage
from invokeai.app.util.prompt_exceptions import PromptNotFoundException


# TODO: Write tests
class PromptsService(EntityServiceABC, EntityExampleABC):

    def example(self) -> PromptRecord:
        self._logger.info("Generating PromptSample")

        return PromptRecord(
            prompt_key="10000",
            category_key=1000,
            positive_prompt="Test Prompt Value",
            negative_prompt="",
            score=50
        )

    def get(self, entity_query: PromptQuery):
        row = self._prompts_storage.query_entry((
            entity_query.prompt_key,
        ))

        if row is None:
            raise PromptNotFoundException()

        return PromptRecord(
            prompt_key=row[0],
            category_key=row[1],
            category_name=row[2],
            positive_prompt=row[3],
            negative_prompt=row[4],
            score=row[5],
        )

    # TODO: Error handling
    def list(self, entity_query: PromptQuery) -> List[PromptRecord]:
        rows = self._prompts_storage.query_entries((
            entity_query.prompt_key if entity_query.prompt_key else 0,
            entity_query.category_name,  # TODO: Lets be honest, category_key would be better
            "%{}%".format(entity_query.positive_prompt) if entity_query.positive_prompt else None,
            "%{}%".format(entity_query.negative_prompt) if entity_query.negative_prompt else None,
            entity_query.score,
            entity_query.page * entity_query.page_size,
            entity_query.page_size
        ))

        return list(map(lambda row: PromptRecord(
            prompt_key=row[0],
            category_key=row[1],
            category_name=row[2],
            positive_prompt=row[3],
            negative_prompt=row[4],
            score=row[5],
        ), rows))

    def create(self, entity_record: PromptRecord):
        self._prompts_storage.create_entry((
            entity_record.category_key,
            entity_record.positive_prompt,
            entity_record.negative_prompt,
            entity_record.score if entity_record.score else 0,
        ))

    def delete(self, entity_query):
        self._prompts_storage.delete_entry((
            entity_query.prompt_key
        ))

    def __init__(self,
                 prompts_storage: PromptsStorage,
                 logger: Logger):
        self._prompts_storage = prompts_storage
        self._prompts_storage.setup()
        self._logger = logger
