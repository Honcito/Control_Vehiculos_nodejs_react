# Control de Vehículos

Aplicación web para el control de entrada y salida de vehículos en un parking privado.  
El proyecto utiliza **React.js** para el frontend, **Node.js + Express.js** para el backend y **SQLite** como base de datos embebida.

---

## Tecnologías utilizadas

- **Frontend:**
  - React.js
  - Tailwind CSS
  - React Hot Toast (notificaciones)
  ---

## Estilos con DaisyUI

El proyecto utiliza **DaisyUI** como framework de componentes CSS sobre Tailwind, lo que permite crear interfaces rápidas, limpias y personalizables.

### Temas Utilizados

Se han configurado **dos temas** principales en `tailwind.config.cjs`:

- 🌞 **Nord**
- 🌙 **Abyss**

La aplicación permite alternar entre estos temas manualmente.

### Ventajas de DaisyUI en el Proyecto

- Componentes listos para usar y totalmente personalizables.
- Cambio de tema dinámico sin recargar la página.
- Estilo uniforme y profesional con mínima configuración adicional.
- Compatibilidad total con Tailwind CSS y React.

- **Backend:**
  - Node.js
  - Express.js
  - SQLite (Base de datos embebida)
  - bcrypt (hash de contraseñas)
- **Otras:**
  - Axios (peticiones HTTP)
  - PDFKit (generación de PDF)

---

## Características principales

- Registro de entradas y salidas de vehículos.
- Autocompletado de datos al introducir la matrícula.
- Edición y borrado de registros.
- Búsqueda avanzada con resaltado y navegación.
- Exportación de los registros a PDF.
- Base de datos local embebida sin necesidad de servidor externo.
- Autenticación con bcrypt.
- Gestión de usuarios con roles (`admin` y `user`).
- Acceso restringido a ciertas operaciones según el rol.
- Diseño responsivo y experiencia de usuario mejorada.
- Confirmación visual de operaciones con notificaciones `react-hot-toast`.

---

## Instalación

### Requisitos previos

- Node.js
- npm
- SQLite (se crea automáticamente el archivo `.db`)

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/control-vehiculos.git
cd control-vehiculos
