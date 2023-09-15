from typing import List

from invokeai.app.api.mappers.dto_mappings import prompt_records_to_dtos
from invokeai.app.services.models.prompt_category_record import CategoryDTO, CategoryRecord
from invokeai.app.services.models.prompt_record import PromptDTO, PromptRecord, PromptSampleDTO


def test_prompt_store_dto_to_record():
    pass


def test_prompt_record_to_sample_dto():
    pass


def test_prompt_records_to_dtos():
    records: List[PromptRecord] = [
        PromptRecord(
            prompt_key=0,
            positive_prompt="test",
            negative_prompt="test",
            category_key=0,
            category_name="test",
            score=0
        )
    ]
    dtos: List[PromptDTO] = prompt_records_to_dtos(records)
    assert dtos is not None
    assert dtos[0].prompt_key == 0
    assert dtos[0].positive_prompt == "test"
    assert dtos[0].negative_prompt == "test"
    assert dtos[0].category_key == 0
    assert dtos[0].category_name == "test"
    assert dtos[0].score == 0


def test_category_dto_to_record():
    pass


def test_category_records_to_dtos():
    pass
