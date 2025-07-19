from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from database import Base, engine, SessionLocal
import models, crud, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def serve_index():
    return FileResponse(os.path.join("static", "index.html"))


@app.get("/form")
def serve_form():
    return FileResponse(os.path.join("static", "form.html"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/items", response_model=list[schemas.Item])
def read_items(db: Session = Depends(get_db)):
    return crud.get_items(db)


@app.post("/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db, item)


@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    db.delete(item)
    db.commit()
    return {"mensaje": "Item eliminado"}
