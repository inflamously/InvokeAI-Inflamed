from abc import abstractmethod, ABC
from typing import Any


class EntityExampleABC(ABC):
    """
    Any class implementing this provides an example object at its API Endpoint
    """
    @abstractmethod
    def example(self) -> Any:
        pass


class EntityServiceABC(ABC):
    """
    Basically CRUD operations 'n' more.
    """

    @abstractmethod
    def create(self, entity_record):
        pass

    @abstractmethod
    def list(self, entity_query):
        pass

    @abstractmethod
    def get(self, entity_query):
        pass

    @abstractmethod
    def delete(self, entity_query):
        pass
