from sqlalchemy import Column, Integer, String
from database import Base

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    image_url = Column(String)

