from typing import List

from invokeai.app.services.models.prompt_category_record import CategoryDTO, CategoryRecord
from invokeai.app.services.models.prompt_record import PromptRecord, PromptSampleDTO, PromptStoreDTO, PromptDTO


def prompt_store_dto_to_record(dto: PromptStoreDTO):
    return PromptRecord(
        category_key=dto.category_key,
        positive_prompt=dto.positive_prompt,
        negative_prompt=dto.negative_prompt,
        score=dto.score
    )


def prompt_record_to_sample_dto(record: PromptRecord):
    return PromptSampleDTO(
        prompt_key=record.prompt_key,
        category_key=record.category_key,
        positive_prompt=record.positive_prompt,
        negative_prompt=record.negative_prompt,
        score=record.score
    )


def prompt_records_to_dtos(records: List[PromptRecord]) -> List[PromptDTO]:
    return list(map(lambda record: PromptDTO(
        prompt_key=record.prompt_key,
        category_key=record.category_key,
        category_name=record.category_name,
        positive_prompt=record.positive_prompt,
        negative_prompt=record.negative_prompt,
        score=record.score
    ), records))


def category_dto_to_record(category_dto: CategoryDTO):
    return CategoryRecord(
        name=category_dto.name
    )


def category_records_to_dtos(records: List[CategoryRecord]) -> List[CategoryDTO]:
    return list(map(lambda record: CategoryDTO(
        category_key=record.category_key,
        name=record.name
    ), records))
