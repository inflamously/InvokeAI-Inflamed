import sqlite3
import threading
from abc import ABC, abstractmethod
from logging import Logger
from sqlite3 import Connection


def filter_entries(entries):
    return tuple(filter(lambda i: i is not None, entries))


class DatabaseOperation:
    """
    Avoid mulithreaded race condition issues and rollback on sqlite3 issues
    """

    def __enter__(self):
        self._lock.acquire(True, 10)

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        In case of any issues just try rollback
        """
        if exc_type is not None:
            self._conn.rollback()
            self._logger.error("{}".format(exc_val))
        self._lock.release()

    def __init__(self, conn: Connection, logger: Logger):
        self._conn = conn
        self._logger = logger
        self._lock = threading.Lock()

    @property
    def lock(self):
        return self._lock


class StorageABC(ABC):

    @abstractmethod
    def setup(self):
        pass

    @abstractmethod
    def create_table(self):
        pass

    @abstractmethod
    def create_entry(self, entry: tuple):
        pass

    @abstractmethod
    def query_entry(self, query_entry: tuple):
        """
        Query a single entry element
        """
        pass

    @abstractmethod
    def query_entries(self, query_entry: tuple):
        """
        Query a single entry from DB using a query_entry object
        """
        pass

    @abstractmethod
    def delete_entry(self, query_entry: tuple):
        """
        Delete an entry from DB
        """
        pass
