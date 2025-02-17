<p align="left">
  <img src="P06.png" height="450" alt="PlantAI FRONTEND"/>
</p>


# PlantAI e-commerce

# Arquitectura de datos Frontend

- React
- Typescript
- Vite
- HTML 5
- CSS 3
- Bootstrap
- Redux Toolkit

# Instalación y Configuración

### 1. Clonar el repositorio

- Abre una terminal en Visual Studio Code o tu editor de preferencia.
- Clona el repositorio desde GitHub ejecutando el siguiente comando:

  ```bash
  git clone https://github.com/bootcamp-uchile-2024/grupo-3-frontend.git
  ```

- Verifica que todo se clonó correctamente, usando el comando:
  ```bash
  git status
  ```

### 2. Navegar a la carpeta del proyecto

- Verifica que te encuentras en la carpeta correcta. Si no es así, utiliza el comando:

  ```bash
  cd grupo-3-frontend
  ```

### 3. Instalar las dependencias

- En la terminal, instala las dependencias de Node.js utilizando:

  ```bash
  npm install
  ```

- Si al instalar genera un reporte de vulnerabilidades, intenta solucionarlo automáticamente ejecutando:
  ```bash
  npm audit fix
  ```

### 4. Instalar Bootstrap, Type checker, Redux toolkit y Stylelint

- Para incluir Bootstrap en el proyecto, ejecuta el siguiente comando en la terminal:

  ```bash
  npm install bootstrap
  npm install bootstrap @popperjs/core
  npm install react-bootstrap-icons
  ```

- Para incluir type checker, ejecuta:

  ```bash
  npm install file-type-checker 
  ```
- Para instalar Redux toolkit, ejecuta:

  ```bash
  npm install @reduxjs/toolkit
  ```
- Para instalar Stylelint, ejecuta:

  ```bash
  npm install --save-dev stylelint stylelint-config-standard
  ```
- Configuración:

Crear: stylelintrc.json en la raíz:

{
  "extends": "stylelint-config-standard"
}

- Agregar script a package.json:

{
  "scripts": {
    "lint:css": "stylelint **/*.css"
  }
}


### 5. Traer los últimos cambios

- Para asegurarte de que estás trabajando con la versión más reciente, sigue estos pasos:

#### 1. Verificar la rama actual

- Asegúrate de estar en la rama correcta utilizando el siguiente comando:

  ```bash
  git branch
  ```

- Esto mostrará una lista de las ramas existentes y marcará con un asterisco (\*) la rama en la que estás actualmente.

#### 2. Cambiar de rama (si es necesario)

- Para cambiar de rama, usa el comando:
  ```bash
  git checkout nombre-de-la-rama
  ```

#### 3. Traer los últimos cambios

- Una vez que estés en la rama correcta, utiliza el siguiente comando para traer los últimos cambios del repositorio remoto:
  ```bash
  git pull origin nombre-de-la-rama
  ```

### 6. Ejecutar el proyecto en desarrollo

- Para visualizar el proyecto en modo desarrollo, utiliza:

  ```bash
  npm run dev
  ```
### 8. Revisar el código del proyecto

- Para revisar el proyecto en busca de errores, ejecuta: 

  ```bash
  npm run lint
  ```

### 8. Compilar el proyecto para producción

- Para compilar el proyecto y preparar los archivos para producción, ejecuta:

  ```bash
  npm run build
  ```
