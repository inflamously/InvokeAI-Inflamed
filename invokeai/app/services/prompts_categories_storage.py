import sqlite3
import threading
from logging import Logger
from typing import cast, Any, Tuple

from invokeai.app.services import storage
from invokeai.app.services.storage import StorageABC
from invokeai.app.util.prompt_exceptions import CategoryAlreadyExistsException


def _sql_query_all_categories_paginated(
    filtered_items: Tuple[Any | None]
):
    where_filter_builder = ""

    if filtered_items[0] is not None: where_filter_builder += "AND name = ?"

    return """--sql
    SELECT category_key, name
    FROM category
    WHERE category_key >= ? {}
    LIMIT ?, ?
    """.format(where_filter_builder)


def _sql_query_category_by_id():
    return """--sql
    SELECT category_key, name
    FROM category
    WHERE category_key = ?
    """


def _sql_create_table():
    return """--sql
    CREATE TABLE IF NOT EXISTS category (
        category_key INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name NVARCHAR(128) NOT NULL UNIQUE
    );
    """


def _sql_insert_entry():
    return """--sql
    INSERT INTO category (name)
    VALUES (?);
    """


# TODO: Re-sort class
class CategoryStorage(StorageABC):

    def query_entry(self, query_entry: tuple):
        with self._lock:
            try:
                self._cursor.execute(
                    _sql_query_category_by_id(),
                    (query_entry[0],)
                )
                return cast(list, self._cursor.fetchone())
            except sqlite3.Error as e:
                self._logger.error(e)
                self._conn.rollback()

    # TODO: Better error handling
    def query_entries(self, query_entry: tuple):
        with self._lock:
            try:
                self._cursor.execute(
                    _sql_query_all_categories_paginated((
                        query_entry[1],
                    )),
                    storage.filter_entries(query_entry)
                )
                rows = cast(list[sqlite3.Row], self._cursor.fetchall())
                return rows
            except sqlite3.Error as e:
                self._logger.error(e)
                self._conn.rollback()

    def create_table(self):
        with self._lock:
            try:
                self._cursor.execute(
                    _sql_create_table()
                )
            except sqlite3.Error as e:
                self._logger.error(e)
                self._conn.rollback()

    def create_entry(self, entry: tuple):
        with self._lock:
            try:
                self._cursor.execute(
                    _sql_insert_entry(),
                    entry
                )
                self._conn.commit()
            except sqlite3.Error as e:
                # TODO: Eval if this is the correct way to handle ?
                if isinstance(e, sqlite3.IntegrityError):
                    raise CategoryAlreadyExistsException()
                self._logger.error(e)
                self._conn.rollback()

    def setup(self):
        with self._lock:
            self._conn.execute("PRAGMA foreign_keys = ON;")
        self.create_table()
        self.__create_default_entry()

    def delete_entry(self, query_entry: tuple):
        pass

    def __init__(self, db_location, logger: Logger):
        self._lock = threading.Lock()
        self._db_location = db_location
        self._conn = sqlite3.connect(db_location, check_same_thread=False)
        self._cursor = self._conn.cursor()
        self._logger = logger
        self.setup()

    def __create_default_entry(self):
        if self.query_entry((1,)) is None:
            self.create_entry((
                "unassigned",
            ))
