from typing import List

import fastapi
from fastapi import APIRouter, HTTPException

from invokeai.app.api.dependencies import ApiDependencies
from invokeai.app.api.mappers import dto_mappings
from invokeai.app.services.models.prompt_record import PromptSampleDTO, PromptDTO, PromptQuery, PromptStoreDTO, \
    PromptDeleteDTO
from invokeai.app.util.prompt_exceptions import PromptNotFoundException, PromptAlreadyExistsException

prompts_router = APIRouter(prefix="/v1/prompts", tags=["prompts"])


@prompts_router.get("/example")
async def prompt_example() -> PromptSampleDTO:
    return dto_mappings.prompt_record_to_sample_dto(
        ApiDependencies.invoker.services.prompts.example()
    )


# TODO: Add success values
# TODO: Bubble already exists error from DB
# TODO: Return real prompt dto with key
@prompts_router.post("")
async def create_prompt(prompt_dto: PromptStoreDTO) -> PromptStoreDTO:
    try:
        ApiDependencies.invoker.services.prompts.create(
            dto_mappings.prompt_store_dto_to_record(prompt_dto)
        )
        return prompt_dto
    except PromptAlreadyExistsException:
        raise fastapi.HTTPException(409, "Prompt already exists with category name, positive and negative prompt.")


# TODO: Add success values
# TODO: Add pagination
@prompts_router.get("")
async def get_prompt_filtered(
    page: int = 0,
    page_size: int = 10,
    prompt_key: int | None = None,
    category_name: str | None = None,
    positive_prompt: str | None = None,
    negative_prompt: str | None = None,
    score: int | None = None,
) -> List[PromptDTO]:
    prompt_records = ApiDependencies.invoker.services.prompts.list(
        PromptQuery(
            page=page,
            page_size=page_size,
            prompt_key=prompt_key,
            category_name=category_name,
            positive_prompt=positive_prompt,
            negative_prompt=negative_prompt,
            score=score
        )
    )
    return dto_mappings.prompt_records_to_dtos(prompt_records)


@prompts_router.get("/{prompt_key}")
async def get_prompt(
    prompt_key: int,
):
    try:
        record = ApiDependencies.invoker.services.prompts.get(
            PromptQuery(
                prompt_key=prompt_key,
            )
        )
        return dto_mappings.prompt_records_to_dtos([record])[0]
    except PromptNotFoundException:
        raise HTTPException(404, "Prompt does not exist")


@prompts_router.delete("/{prompt_key}")
async def delete_prompt(
    prompt_key: int,
):
    ApiDependencies.invoker.services.prompts.delete(
        PromptQuery(
            prompt_key=prompt_key
        )
    )
    return PromptDeleteDTO(
        prompt_key=prompt_key,
    )
