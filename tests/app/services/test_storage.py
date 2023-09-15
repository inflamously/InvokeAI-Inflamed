import sqlite3
import threading
import time

import pytest

from invokeai.app.services.storage import DatabaseOperation

GLOBAL_DATABASE_OPERATION = DatabaseOperation(None, None)
GLOBAL_DATA = []


@pytest.fixture()
def mock_database_operation():
    class MockDatabaseOperation(DatabaseOperation):
        def __exit__(self, exc_type, exc_val, exc_tb):
            raise sqlite3.Error()

    return MockDatabaseOperation(None, None)


def thread_func(operation: DatabaseOperation, name: str):
    print("Thread before operation {}".format(name))
    print("Operation locked {}".format(GLOBAL_DATABASE_OPERATION.lock.locked()))
    with GLOBAL_DATABASE_OPERATION:
        GLOBAL_DATA.append(1)
        time.sleep(5)
        print("Thread within operation {}".format(name))
    print("Thread after operation {}".format(name))


def test_storage_database_operation():
    a = threading.Thread(target=thread_func, args=(GLOBAL_DATABASE_OPERATION, "a"))
    b = threading.Thread(target=thread_func, args=(GLOBAL_DATABASE_OPERATION, "b"))
    a.start()
    b.start()

    while len(GLOBAL_DATA) < 2 or GLOBAL_DATABASE_OPERATION.lock.locked():
        time.sleep(0.5)

    assert len(GLOBAL_DATA) == 2
    assert GLOBAL_DATA[0] == 1
    assert GLOBAL_DATA[1] == 1


def test_exception_database_operation(mock_database_operation):
    with pytest.raises(Exception):
        with mock_database_operation:
            pass


def test_real_exception_database_operation(mock_database_operation):
    crashed = False
    try:
        with mock_database_operation:
            crashed = True
            raise sqlite3.Error()
    except sqlite3.Error:
        assert crashed
