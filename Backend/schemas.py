from pydantic import BaseModel

class ItemBase(BaseModel):
    title: str
    description: str
    image_url: str

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    class Config:
        from_attributes = True
