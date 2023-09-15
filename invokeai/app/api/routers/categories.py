from typing import List

from fastapi import APIRouter, HTTPException

from invokeai.app.api.dependencies import ApiDependencies
from invokeai.app.api.mappers import dto_mappings
from invokeai.app.services.models.prompt_category_record import CategoryDTO, CategoryQuery
from invokeai.app.util.prompt_exceptions import CategoryNotFoundException, CategoryAlreadyExistsException

category_router = APIRouter(prefix="/v1/categories", tags=["categories"])


# TODO: Add success values
# TODO: Return real category dto with key
@category_router.post("")
async def create_category(category_dto: CategoryDTO) -> CategoryDTO:
    try:
        ApiDependencies.invoker.services.categories.create(
            dto_mappings.category_dto_to_record(category_dto)
        )
        return category_dto
    except CategoryAlreadyExistsException:
        raise HTTPException(409, "Category already exists with name.")


@category_router.get("")
async def get_categories_filtered(
    page_size: int = 10,
    category_key: int | None = None,  # TODO: Category Key or By Category Key or At_Category Key?
    name: str | None = None,
) -> List[CategoryDTO]:
    """
    Here we use either pagination with key to filter complete rows
    or using one of the specific fields to filter only matching value
    """
    category_records = ApiDependencies.invoker.services.categories.list(
        CategoryQuery(
            page_size=page_size,
            category_key=category_key,
            name=name
        )
    )
    return dto_mappings.category_records_to_dtos(category_records)


@category_router.get("/{category_key}")
async def get_category(
    category_key: int,
):
    try:
        record = ApiDependencies.invoker.services.categories.get(
            CategoryQuery(
                category_key=category_key,
            )
        )
        return dto_mappings.category_records_to_dtos([record])[0]
    except CategoryNotFoundException:
        raise HTTPException(404, "Category does not exist")

@category_router.delete("/{category_key}")
async def delete_category(
    category_key: int,
):
    pass
    # ApiDependencies.invoker.services.categories.delete_category();
