// app/login/page.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const urlProd = 'https://api.creanova.re';
    const urlLocal = 'http://localhost:3333';

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${urlProd}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Adresse e-mail ou mot de passe incorrect.');
                } else {
                    throw new Error("Une erreur s'est produite. Veuillez réessayer plus tard.");
                }
            }

            const data = await response.json();
            console.log(data.message);
            router.push('/projects');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <nav>
                <a href="/projects">Page</a>
            </nav>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    required
                />
                <button type="submit">Se connecter</button>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;
