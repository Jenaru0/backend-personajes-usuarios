```markdown
# Documentación de APIs – Backend

**GitHub:**  
[https://github.com/Jenaru0/backend](https://github.com/Jenaru0/backend)

**Render:**  
[https://backend-5c6p.onrender.com/](https://backend-5c6p.onrender.com/)

---

## Recursos Adjuntos

- **Colección de Postman:**  
  Archivo: `Backend_API_Tests.postman_collection.json`

- **Entorno de Postman:**  
  Archivo: `Backend_API.postman_environment.json`

- **Video Demostrativo:**  
  Video (formato MP4, 2–3 minutos) mostrando la ejecución automática de las pruebas en Postman.

---

## 1. Autenticación

### 1.1 Registro de Usuario (Rol REGULAR por defecto)
- **Endpoint:** `POST /auth/register`
- **Descripción:** Permite que cualquier usuario se registre.  
  *Nota:* Los usuarios se crean con rol `REGULAR` por defecto.
- **Headers:**  
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "nombre": "Usuario Prueba",
    "correo": "prueba@example.com",
    "contraseña": "prueba_password"
  }
  ```
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "message": "Usuario registrado exitosamente",
    "usuario": {
      "id": "UUID",
      "nombre": "Usuario Prueba",
      "correo": "prueba@example.com",
      "rol": "REGULAR"
    }
  }
  ```
- **Notas:**  
  El test de esta petición guarda el `usuario.id` en la variable `userId`.

### 1.2 Login de Usuario

#### Usuario REGULAR
- **Endpoint:** `POST /auth/login`
- **Headers:**  
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "correo": "prueba@example.com",
    "contraseña": "prueba_password"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Login exitoso",
    "token": "JWT token"
  }
  ```
- **Notas:**  
  El test guarda el token en la variable `userToken`.

#### Usuario ADMIN
*(Debe existir un usuario ADMIN previamente con credenciales conocidas, por ejemplo, `admin@example.com` / `admin_password`.)*
- **Endpoint:** `POST /auth/login`
- **Headers:**  
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "correo": "admin@example.com",
    "contraseña": "admin_password"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Login exitoso",
    "token": "JWT token"
  }
  ```
- **Notas:**  
  El test guarda el token en la variable `adminToken`.

---

## 2. CRUD de Usuarios (Operaciones solo para ADMIN)
*(Requiere el header: `Authorization: Bearer {{adminToken}}`)*

### 2.1 Listar Usuarios
- **Endpoint:** `GET /usuarios/`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "usuarios": [
      {
        "id": "UUID",
        "nombre": "Usuario Prueba",
        "correo": "prueba@example.com",
        "rol": "REGULAR",
        "isActive": true,
        "createdAt": "fecha",
        "updatedAt": "fecha"
      },
      ...
    ]
  }
  ```

### 2.2 Actualizar Usuario (Ej: Cambiar Rol a ADMIN)
- **Endpoint:** `PUT /usuarios/{{userId}}`
- **Headers:**  
  - `Content-Type: application/json`
  - `Authorization: Bearer {{adminToken}}`
- **Body:**
  ```json
  {
    "rol": "ADMIN"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Usuario actualizado",
    "usuario": {
      "id": "{{userId}}",
      "nombre": "Usuario Prueba",
      "correo": "prueba@example.com",
      "rol": "ADMIN",
      "isActive": true,
      "createdAt": "fecha",
      "updatedAt": "fecha"
    }
  }
  ```

### 2.3 Soft Delete de Usuario
- **Endpoint:** `DELETE /usuarios/{{userId}}`
- **Headers:**  
  - `Authorization: Bearer {{adminToken}}`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Usuario eliminado (soft delete)",
    "usuario": {
      "id": "{{userId}}",
      "isActive": false,
      ...
    }
  }
  ```

---

## 3. CRUD de Personajes
*(Requiere el header: `Authorization: Bearer {{userToken}}` o `{{adminToken}}` según corresponda)*

### 3.1 Crear un Personaje
- **Endpoint:** `POST /personajes`
- **Headers:**  
  - `Content-Type: application/json`
  - `Authorization: Bearer {{userToken}}`
- **Body:**
  ```json
  {
    "nombre": "Personaje PRUEBA",
    "foto": "https://ejemplo.com/foto1.jpg"
  }
  ```
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "message": "Personaje creado",
    "personaje": {
      "id": "UUID",
      "nombre": "Personaje PRUEBA",
      "foto": "https://ejemplo.com/foto1.jpg",
      "userId": "UUID del usuario",
      "createdAt": "fecha",
      "updatedAt": "fecha"
    }
  }
  ```
- **Notas:**  
  El test guarda el `personaje.id` en la variable `personajeId`.

### 3.2 Listar Personajes del Usuario
- **Endpoint:** `GET /personajes/list`
- **Headers:**  
  - `Authorization: Bearer {{userToken}}`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "personajes": [
      {
        "id": "UUID",
        "nombre": "Personaje PRUEBA",
        "foto": "https://ejemplo.com/foto1.jpg",
        "userId": "UUID del usuario",
        "createdAt": "fecha",
        "updatedAt": "fecha"
      },
      ...
    ]
  }
  ```

### 3.3 Obtener un Personaje por ID
- **Endpoint:** `GET /personajes/only/{{personajeId}}`
- **Headers:**  
  - `Authorization: Bearer {{userToken}}`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "personaje": {
      "id": "{{personajeId}}",
      "nombre": "Personaje PRUEBA",
      "foto": "https://ejemplo.com/foto1.jpg",
      "userId": "UUID del usuario",
      "createdAt": "fecha",
      "updatedAt": "fecha"
    }
  }
  ```

### 3.4 Actualizar un Personaje
- **Endpoint:** `PUT /personajes/{{personajeId}}`
- **Headers:**  
  - `Content-Type: application/json`
  - `Authorization: Bearer {{userToken}}`
- **Body:**
  ```json
  {
    "nombre": "Personaje 1 Actualizado",
    "foto": "https://ejemplo.com/foto_actualizada123.jpg"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Personaje actualizado",
    "personaje": {
      "id": "{{personajeId}}",
      "nombre": "Personaje 1 Actualizado",
      "foto": "https://ejemplo.com/foto_actualizada123.jpg",
      "userId": "UUID del usuario",
      "createdAt": "fecha",
      "updatedAt": "fecha"
    }
  }
  ```

### 3.5 Eliminar un Personaje
- **Endpoint:** `DELETE /personajes/{{personajeId}}`
- **Headers:**  
  - `Authorization: Bearer {{userToken}}`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Personaje eliminado"
  }
  ```

---

## Instrucciones para Importar y Ejecutar en Postman

1. **Importar Colección y Entorno:**
   - Abre Postman y haz clic en **Import**.
   - Selecciona el archivo `Backend_API_Tests.postman_collection.json` para importar la colección.
   - Selecciona también el archivo `Backend_API.postman_environment.json` para importar el entorno.
   - Asegúrate de seleccionar el entorno "Backend API" en la parte superior derecha.

2. **Ejecutar la Colección Completa:**
   - Abre el **Collection Runner** en Postman.
   - Selecciona la colección "Backend API Tests" y el entorno "Backend API".
   - Haz clic en **Run** para ejecutar todas las peticiones.
   - Verifica en el resumen que todos los tests han pasado.

---
