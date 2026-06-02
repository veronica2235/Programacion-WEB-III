\# Práctica Node.js + Express + MySQL + Thunder Client



Este proyecto implementa una API REST para gestionar categorías y productos usando Node.js, Express y MySQL.



\## Endpoints desarrollados



\### 1. Crear categoría

POST /categorias



Permite registrar una nueva categoría enviando nombre y descripcion en el body.



\### 2. Listar categorías

GET /categorias



Devuelve todas las categorías registradas en la base de datos.



\### 3. Obtener categoría por ID con productos

GET /categorias/:id



Devuelve una categoría específica y todos los productos que pertenecen a esa categoría.



\### 4. Actualizar categoría

PATCH /categorias/:id



Permite actualizar el nombre y la descripción de una categoría.



\### 5. Eliminar categoría

DELETE /categorias/:id



Elimina una categoría y también elimina automáticamente sus productos relacionados.



\## Tecnologías usadas



\- Node.js

\- Express

\- MySQL

\- mysql2

\- cors

\- Thunder Client

\- XAMPP

