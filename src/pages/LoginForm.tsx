import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../LoginFormStyles.css';

interface LoginFormProps {
    onLogin: (username: string, role: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const navigate = useNavigate();

    // Lista de usuarios simulada -- Roles usuario y administrador
    const users = [
        { username: 'administrador', password: 'administrador', role: 'admin' },
        { username: 'usuario', password: 'usuario', role: 'user' }
    ];

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        usernameError: '',
        passwordError: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [`${name}Error`]: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Buscar por nombre de usuario
        const foundUser = users.find(user => user.username === formData.username);

        // Validación
        if (!foundUser) {
            setErrors({ ...errors, usernameError: 'Nombre de usuario incorrecto' });
            return;
        }

        // Validación de la contraseña
        if (foundUser.password !== formData.password) {
            setErrors({ ...errors, passwordError: 'Contraseña incorrecta' });
            return;
        }

        // Guardar usuario en localStorage
        const userResponse = { username: foundUser.username, role: foundUser.role };
        localStorage.setItem('user', JSON.stringify(userResponse));

        // Alert
        alert(`Iniciaste sesión como ${foundUser.role === 'admin' ? 'Admin' : 'User'}`);
        onLogin(foundUser.username, foundUser.role);

        // Redirigir
        navigate('/');
    };

    return (
        <main className="form-signin col-md-3 col-xs-3 col-lg-3 m-auto relative-top">
            <form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal">Iniciar Sesión</h1>

                <div className="form-floating">
                    <input
                        type="text"
                        className={`form-control ${errors.usernameError ? 'is-invalid' : ''}`}
                        id="floatingInput"
                        placeholder="Nombre de usuario"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="floatingInput">Nombre de usuario</label>
                    {errors.usernameError && <div className="invalid-feedback">{errors.usernameError}</div>}
                </div>

                <div className="form-floating">
                    <input
                        type="password"
                        className={`form-control ${errors.passwordError ? 'is-invalid' : ''}`}
                        id="floatingPassword"
                        placeholder="Contraseña"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="floatingPassword">Contraseña</label>
                    {errors.passwordError && <div className="invalid-feedback">{errors.passwordError}</div>}
                </div>

                <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Recordarme
                    </label>
                </div>

                <button className="btn btn-primary w-100 py-2" type="submit">Iniciar Sesión</button>

                <p className="mt-3">
                    ¿No tienes una cuenta? <Link to="/create-user">Crear una cuenta</Link>
                </p>
            </form>
        </main>
    );
};

export default LoginForm;
