import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  //
  

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded Token:', decodedToken); // Verifica el contenido del token
        const role = decodedToken.rol;
        const nombreUsuario = decodedToken.nombre;
        localStorage.setItem('nombre', nombreUsuario);
        localStorage.setItem('role', role);

        navigate(role === 'administrador' ? '/admin-dashboard' : '/user-dashboard');
      }
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Iniciar Sesión</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={handleLogin} style={styles.loginButton}>
          Iniciar Sesión
        </button>
        <button onClick={() => navigate('/registerUser')} style={styles.registerButton}>
          Registrarse
        </button>
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
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'background-color 0.3s ease',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#6c757d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loginButtonHover: {
    backgroundColor: '#0056b3',
  },
  registerButtonHover: {
    backgroundColor: '#565e64',
  },
  error: {
    color: '#ff4d4f',
    fontSize: '0.9rem',
    marginBottom: '15px',
  },
};

export default LoginPage;
