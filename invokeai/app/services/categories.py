from abc import ABC, abstractmethod
from logging import Logger

from invokeai.app.services.entity import EntityServiceABC
from invokeai.app.services.models.prompt_category_record import CategoryQuery, CategoryRecord
from invokeai.app.services.prompts_categories_storage import CategoryStorage
from invokeai.app.util.prompt_exceptions import CategoryNotFoundException


class CategoryService(EntityServiceABC):
    def create(self, entity_record: CategoryRecord):
        self._category_storage.create_entry((entity_record.name,))

    # TODO: Error handling
    def list(self, entity_query: CategoryQuery):
        """
        Query either filtered by using fields provided
        or complete table pagination based
        """
        # Providen category_key we skip over some rows for better performance
        rows = self._category_storage.query_entries((
            entity_query.category_key if entity_query.category_key else 0,
            entity_query.name,
            entity_query.page,
            entity_query.page_size
        ))
        return list(map(lambda row: CategoryRecord(
            category_key=row[0],
            name=row[1]
        ), rows))

    def get(self, entity_query: CategoryQuery):
        row = self._category_storage.query_entry((
            entity_query.category_key,
        ))

        if row is None:
            raise CategoryNotFoundException()

        return CategoryRecord(
            category_key=row[0],
            name=row[1]
        )

    def delete(self, entity_query: CategoryQuery):
        pass

    def __init__(
        self,
        category_storage: CategoryStorage,
        logger: Logger
    ):
        self._category_storage = category_storage
        self._category_storage.setup()
        self._logger = logger
