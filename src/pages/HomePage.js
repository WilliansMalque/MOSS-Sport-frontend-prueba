import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Bienvenido a MOSS-Sport</h1>
        <p style={styles.subtitle}>Gestiona tus torneos deportivos de manera fácil y rápida.</p>
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => navigate('/login')} 
            style={styles.button}
          >
            Ingresar
          </button>
          <button 
            onClick={() => navigate('/register')} 
            style={styles.button}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f9fc',
    fontFamily: "'Arial', sans-serif",
  },
  content: {
    textAlign: 'center',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default HomePage;
