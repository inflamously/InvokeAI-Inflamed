import sqlite3
import threading
from logging import Logger
from typing import cast, Any

from invokeai.app.services import storage
from invokeai.app.services.storage import StorageABC, DatabaseOperation
from invokeai.app.util.prompt_exceptions import PromptAlreadyExistsException


# TODO: Maybe optimize query without inner join using only ID from category instead of name for filter?
def _sql_query_all_prompts_with_categories_paginated(
    filtered_items: (Any | None, Any | None, Any | None, Any | None)
):
    where_filter_builder = ""

    if filtered_items[0] is not None: where_filter_builder += "AND category.name = ? "
    if filtered_items[1] is not None: where_filter_builder += "AND prompts.positive_prompt LIKE ? "
    if filtered_items[2] is not None: where_filter_builder += "AND prompts.negative_prompt LIKE ? "
    if filtered_items[3] is not None: where_filter_builder += "AND score >= ?"

    return """--sql
    SELECT prompts.prompt_key, category.category_key, category.name, prompts.positive_prompt, prompts.negative_prompt, prompts.score
    FROM prompts
    INNER JOIN category ON prompts.category_key=category.category_key
    WHERE prompts.prompt_key >= ? {}
    ORDER BY prompts.prompt_key
    LIMIT ?, ?
    """.format(where_filter_builder)


def _sql_query_prompt_with_category_by_id():
    return """--sql
    SELECT prompts.prompt_key, category.category_key, category.name, prompts.positive_prompt, prompts.negative_prompt, prompts.score
    FROM prompts
    INNER JOIN category ON prompts.category_key=category.category_key
    WHERE prompts.prompt_key = ?
    """


def _sql_insert_entry():
    return """--sql
    INSERT INTO prompts (category_key, positive_prompt, negative_prompt, score)
    VALUES (?, ?, ?, ?);
    """


def _sql_create_table():
    return """--sql
    CREATE TABLE IF NOT EXISTS prompts (
        prompt_key INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        category_key INTEGER NOT NULL,
        positive_prompt TEXT NOT NULL,
        negative_prompt TEXT NOT NULL,
        score INT NOT NULL,
        FOREIGN KEY (category_key) REFERENCES category(category_key),
        UNIQUE (category_key, positive_prompt, negative_prompt) ON CONFLICT ROLLBACK
    );
    """


def _sql_delete_prompt():
    return """--sql
    DELETE FROM prompts
    WHERE prompt_key = ?
    """


class PromptsStorage(StorageABC):

    def query_entry(self, query_entry: tuple):
        with DatabaseOperation(self._conn, self._logger):
            self._cursor.execute(
                _sql_query_prompt_with_category_by_id(),
                (query_entry[0],)
            )
            return cast(list, self._cursor.fetchone())

    def query_entries(self, query_entry: tuple):
        with DatabaseOperation(self._conn, self._logger):
            self._cursor.execute(
                _sql_query_all_prompts_with_categories_paginated((
                    query_entry[1],
                    query_entry[2],
                    query_entry[3],
                    query_entry[4],
                )),
                # This filters out None values matching above sql filter tuple
                storage.filter_entries(query_entry)
            )
            rows = cast(list[sqlite3.Row], self._cursor.fetchall())
            return rows

    def create_entry(self, entry: tuple):
        try:
            with DatabaseOperation(self._conn, self._logger):
                self._cursor.execute(
                    _sql_insert_entry(),
                    entry
                )
                self._conn.commit()
        except sqlite3.IntegrityError:
            raise PromptAlreadyExistsException()

    def setup(self):
        with DatabaseOperation(self._conn, self._logger):
            self._conn.execute("PRAGMA foreign_keys = ON;")
        self.create_table()

    def create_table(self):
        with DatabaseOperation(self._conn, self._logger):
            self._cursor.execute(
                _sql_create_table()
            )
            self._conn.commit()

    def delete_entry(self, query_entry: tuple):
        with DatabaseOperation(self._conn, self._logger):
            self._cursor.execute(
                _sql_delete_prompt(),
                storage.filter_entries((query_entry,))
            )
            self._conn.commit()

    def __init__(self, db_location, logger: Logger):
        self._lock = threading.Lock()
        self._db_location = db_location
        self._conn = sqlite3.connect(db_location, check_same_thread=False)
        self._cursor = self._conn.cursor()
        self._logger = logger
        self.setup()
