# Task Manager

Aplicación de gestión de proyectos y tareas con Spring Boot, Thymeleaf y MySQL.

## Ejecutar con Docker

Necesitas Docker Desktop con Docker Compose habilitado.

1. Copia `.env.example` a `.env` en la carpeta del proyecto. En PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Inicia la aplicación y la base de datos:

   ```powershell
   docker compose up --build
   ```

3. Abre [http://localhost:8080](http://localhost:8080) y regístrate.
4. Para detener los contenedores, presiona `Ctrl+C` y ejecuta:

   ```powershell
   docker compose down
   ```

La base de datos queda guardada en un volumen de Docker, así que los datos se conservan al detener y volver a iniciar la aplicación. Para borrar también los datos locales de prueba:

```powershell
docker compose down --volumes
```

El archivo `.env` contiene credenciales para pruebas locales y está excluido de Git. No subas contraseñas ni claves reales al repositorio. `.env.example` solo contiene valores de demostración.

## Probar la API

Swagger está disponible en [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html). Inicia sesión desde la aplicación, copia el token devuelto por el endpoint de inicio de sesión y úsalo con **Authorize** para probar los endpoints protegidos.

## Ejecutar sin Docker

Se requiere Java 21 y un servidor MySQL. Crea una base de datos llamada `taskmanager` y configura las variables `DB_USERNAME`, `DB_PASSWORD` y `JWT_SECRET`. Luego, desde PowerShell:

```powershell
mvn spring-boot:run
```

También puedes proporcionar variables de entorno para esa sesión de PowerShell antes de ejecutar la aplicación:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "tu_clave_local"
$env:JWT_SECRET = "clave-local-de-prueba-de-al-menos-32-caracteres"
mvn spring-boot:run
```
