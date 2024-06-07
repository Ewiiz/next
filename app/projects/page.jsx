'use client';

import { useState, useEffect } from 'react';
import styles from './Projects.module.css';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const urlProd = 'https://api.creanova.re';
    const urlLocal = 'http://localhost:3333';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${urlProd}/bo/projects`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`Une erreur s'est produite lors de la récupération des projets.`);
                }
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                setError(error.message); // Correction de la gestion de l'erreur ici
            }
        };

        fetchProjects();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${urlProd}/check`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setAuthMessage(`Authenticated: ${data.authenticated}`);
                alert(`Authenticated: ${data.authenticated}`);
            } else {
                setAuthMessage(`Erreur lors de la vérification de l'authentification`);
                console.error(`Erreur lors de la vérification de l'authentification`);
            }
        } catch (error) {
            setAuthMessage(`Erreur: ${error.message}`);
            console.error('Erreur:', error);
        }
    };

    return (
        <div className={styles.projectsContainer}>
            <h1>Liste des Projets pour le BACK-OFFICE 👑</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {authMessage && <p className={styles.authMessage}>{authMessage}</p>}
            <button onClick={checkAuth} className={styles.checkAuthButton}>
                Vérifier l authentification
            </button>
            <ul className={styles.projectList}>
                {projects.map((project) => (
                    <li key={project.id} className={styles.projectItem}>
                        <h2>{project.name}</h2>
                        {project.projectImage.length > 0 && (
                            <img
                                src={project.projectImage[0].imageUrl}
                                alt={project.name}
                                className={styles.projectImage}
                            />
                        )}
                        {project.tags.length > 0 && (
                            <ul className={styles.tagList}>
                                {project.tags.map((tag, index) => (
                                    <li key={index} className={styles.tagItem}>{tag.name}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Projects;
