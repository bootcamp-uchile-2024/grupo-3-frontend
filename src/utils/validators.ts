// validators.ts

export const validateUsername = (username: string) => {
    if (!username) {
      return 'El nombre de usuario es requerido';
    }
    return '';
  };
  
  export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'El correo es requerido';
    } else if (!emailRegex.test(email)) {
      return 'El correo no es válido';
    }
    return '';
  };
  
  export const validatePassword = (password: string) => {
    if (!password) {
      return 'La contraseña es requerida';
    } else if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };
  
  // Nueva función para validar la confirmación de contraseña
  export const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };
  