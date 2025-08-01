# ZETA

Sistema académico basado en **Node.js**, **Express** y **MongoDB**. Este proyecto usa vistas HTML básicas y una API REST para gestionar usuarios, materias, notas y más.

## Instalación

1. Clona este repositorio y entra en la carpeta del proyecto.
2. Ejecuta `npm install` para instalar las dependencias.

## Configuración del entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```bash
MONGODB_URI=<cadena de conexión a MongoDB>
JWT_SECRET=<clave para firmar tokens>
JWT_EXPIRES_IN=1h       # opcional
BCRYPT_ROUNDS=10        # opcional
PORT=3000               # puerto del servidor
```

Asegúrate de que MongoDB esté disponible y que la URI tenga permisos para crear las colecciones.

## Población de datos (Seed Scripts)

El directorio `scripts/` contiene utilidades para cargar datos iniciales a partir de los archivos JSON ubicados en `utils/`.

Ejecuta cada uno de los siguientes comandos según los datos que desees insertar:

```bash
node seedUsers.js                 # Usuarios de ejemplo
node scripts/seedSubjects.js      # Materias
node scripts/seedGrades.js        # Notas
node scripts/seedPeriods.js       # Periodos académicos
node scripts/seedComments.js      # Comentarios
```

Estos scripts eliminarán los registros previos de cada colección antes de insertar la información nueva.

## Uso

Con las dependencias instaladas y el archivo `.env` configurado puedes iniciar el proyecto con:

```bash
npm start        # ejecuta index.js
# o bien
npm run dev      # usa nodemon para recargar en desarrollo
```

El servidor iniciará en el puerto especificado (por defecto `3000`). Accede a `http://localhost:3000/` para ver la pantalla de inicio.

Cada módulo cuenta con rutas protegidas que requieren autenticación mediante JWT y cookies.
