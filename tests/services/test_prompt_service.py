from logging import Logger

import pytest

from invokeai.app.services.prompts import PromptsService
from invokeai.app.services.storage import StorageABC


@pytest.fixture
def mock_logger():
    return Logger(name="test", level=0)


@pytest.fixture
def mock_storage():
    class MockStorage(StorageABC):
        def delete_entry(self, query_entry: tuple):
            pass

        def setup(self):
            pass

        def create_table(self):
            pass

        def create_entry(self, entry: tuple):
            pass

        def query_entry(self, query_entry: tuple):
            pass

        def query_entries(self, query_entry: tuple):
            pass

    return MockStorage()


def test_get_categories(mock_logger, mock_storage):
    service = PromptsService(mock_storage, mock_logger)
