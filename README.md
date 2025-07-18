# Tarea Grupal 3



---

## Arquitectura

```
Cliente (HTML/JS) --> FastAPI (Endpoints REST + StaticFiles) --> MySQL
                                    |
                               SQLAlchemy ORM
```

- El backend expone endpoints JSON (`/items`).
- El frontend (en `/static`) consume:
  - Una API externa (perros) vía JavaScript.
  - La API local para mostrar y añadir ítems.
- Persistencia: tabla `items` en MySQL.

---

## Stack Tecnológico

| Capa         | Tecnología                  |
|--------------|-----------------------------|
| Backend      | FastAPI                     |
| ORM          | SQLAlchemy                  |
| Validación   | Pydantic                    |
| Servidor Dev | Uvicorn                     |
| BD           | MySQL (driver `pymysql`)    |
| Frontend     | HTML + CSS + JS (módulos)   |

Archivo `requirements.txt` incluye:
```
fastapi
uvicorn
sqlalchemy
pydantic
mysql-connector-python
pymysql
```

> *Nota:* `mysql-connector-python` y `pymysql` no son ambos estrictamente necesarios; se usa el dialecto `mysql+pymysql`. Podrías limpiar dependencias si lo deseas.

---

## Estructura de Directorios

```
Tarea Grupal 3/
├─ requirements.txt
├─ Backend/
│  ├─ main.py              # Punto de entrada FastAPI
│  ├─ database.py          # Configuración de SQLAlchemy y URL de conexión
│  ├─ models.py            # Declaración del modelo Item
│  ├─ schemas.py           # Esquemas Pydantic (Item, ItemCreate)
│  ├─ crud.py              # Funciones de acceso a datos
│  ├─ static/
│  │  ├─ index.html
│  │  ├─ form.html
│  │  ├─ css/
│  │  └─ js/
│  └─ __pycache__/...
└─ venv/ (opcional / local)
```

---

## Modelo de Datos

Tabla: **items**

| Campo       | Tipo     | Descripción                     |
|-------------|----------|---------------------------------|
| id          | Integer (PK, autoincrement) | Identificador único |
| title       | String   | Título del ítem                |
| description | String   | Descripción breve              |
| image_url   | String   | URL a una imagen asociada      |

---

## Instalación y Puesta en Marcha

1. **Clonar / Extraer** el proyecto.
2. (Opcional pero recomendado) Crear y activar un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scriptsctivate     # Windows
   ```
3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

---

## Configuración de la Base de Datos

En `database.py` se define:

```python
DATABASE_URL = "mysql+pymysql://root:Coco197209@localhost/proyecto_web"
```

### Pasos:

1. Asegúrate de tener MySQL en ejecución.
2. Crea la base de datos (si no existe):
   ```sql
   CREATE DATABASE proyecto_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. (Opcional) Cambia usuario/contraseña en `DATABASE_URL` a valores seguros y usa variables de entorno, por ejemplo:

   ```python
   import os
   user = os.getenv("DB_USER", "root")
   pwd  = os.getenv("DB_PASS", "")
   host = os.getenv("DB_HOST", "localhost")
   db   = os.getenv("DB_NAME", "proyecto_web")
   DATABASE_URL = f"mysql+pymysql://{user}:{pwd}@{host}/{db}"
   ```

4. Al iniciar la app, `Base.metadata.create_all(bind=engine)` creará la tabla automáticamente si no existe.

---

## Ejecutar el Servidor

Desde el directorio `Backend/` (donde está `main.py`):

```bash
uvicorn main:app --reload
```

Por defecto servirá en: `http://127.0.0.1:8000`

Documentación interactiva:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

## Endpoints de la API

| Método | Ruta        | Descripción                          | Body esperado                        | Respuesta |
|--------|-------------|--------------------------------------|--------------------------------------|-----------|
| GET    | `/`         | Devuelve `index.html` (frontend)     | —                                    | HTML      |
| GET    | `/form`     | Devuelve `form.html`                 | —                                    | HTML      |
| GET    | `/items`    | Lista todos los ítems                | —                                    | JSON `[Item]` |
| POST   | `/items`    | Crea un nuevo ítem                   | JSON `{title, description, image_url}` | JSON `Item` |

### Ejemplo de POST

```bash
curl -X POST "http://127.0.0.1:8000/items"   -H "Content-Type: application/json"   -d '{
        "title": "Perro feliz",
        "description": "Imagen de un perro sonriente",
        "image_url": "https://ejemplo.com/perro.jpg"
      }'
```

Respuesta:

```json
{
  "id": 1,
  "title": "Perro feliz",
  "description": "Imagen de un perro sonriente",
  "image_url": "https://ejemplo.com/perro.jpg"
}
```

---

## Flujo Frontend

1. **`index.html`**:
   - Carga scripts JS que:
     - Consultan la API externa (sección “API externa (perros)”).
     - Llaman a `GET /items` para mostrar registros guardados.
2. **`form.html`**:
   - Formulario simple que hace `fetch` al endpoint `POST /items`.
   - Tras crear un ítem, se puede regresar al índice para ver la lista actualizada.

> Asegúrate que las rutas de los scripts y CSS estén correctas: `/<lo_que_sea>` se sirve desde `StaticFiles(directory="static")` montado en `main.py`.

---

## Validaciones y Esquemas (Pydantic)

En `schemas.py`:

- `ItemBase`: define campos obligatorios (`title`, `description`, `image_url`).
- `ItemCreate`: igual a `ItemBase` (separación preparada para futuras validaciones).
- `Item`: hereda de `ItemBase` y agrega `id` + `Config.from_attributes = True` para permitir conversión desde el modelo ORM.

---

## Notas sobre CORS y Estáticos

En `main.py` se añade:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Esto permite que el frontend (o cualquier origen) consuma la API sin restricciones.  
> *Recomendación:* En producción limitar `allow_origins` a dominios específicos.

Archivos estáticos:

```python
app.mount("/static", StaticFiles(directory="static"), name="static")
```

---

## Posibles Mejoras Futuras

| Área                | Mejora Sugerida |
|---------------------|------------------|
| Seguridad           | Usar variables de entorno, gestionar .env, restringir CORS. |
| Validación          | Añadir longitud mínima/máxima, validación de URL para `image_url`. |
| Base de Datos       | Migraciones con Alembic. |
| Autenticación       | JWT / OAuth2 para crear ítems autenticados. |
| Tests               | Pytest para CRUD y respuestas HTTP. |
| Frontend            | Framework (Vue/React) o mejorar manejo de errores JS. |
| Manejo de Errores   | Respuestas personalizadas (HTTPException) en casos de fallo. |
| Dockerización       | Añadir `Dockerfile` y `docker-compose.yml` (app + MySQL). |

---

### Resumen Rápido (TL;DR)

1. Crea BD `proyecto_web` en MySQL.  
2. Ajusta `DATABASE_URL` si es necesario.  
3. `pip install -r requirements.txt`  
4. `uvicorn main:app --reload` (desde `Backend/`).  
5. Visita `http://127.0.0.1:8000/` para el frontend y `/docs` para probar la API.

