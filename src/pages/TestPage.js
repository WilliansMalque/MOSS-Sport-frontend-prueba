import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EquipoTable from '../components/EquipoTableUser'; // Asumiendo que el componente se llama EquipoTable
import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper } from '@mui/material';

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Obtener el nombre del usuario logueado desde localStorage o decodificar el token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserName(decodedToken.nombre); // Establecer el nombre del usuario logueado
    }
  }, []);
  
  useEffect(() => {
    // Obtener los equipos desde la API
    const fetchEquipos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/equipos/detalles');
        const equiposData = response.data;

        // Filtrar los equipos donde el nombre del capitán coincida con el nombre del usuario logueado
        const equiposFiltrados = equiposData.filter((equipo) => equipo.nombre_capitan === userName);
        setEquipos(equiposFiltrados);
      } catch (error) {
        console.error('Error al obtener los equipos:', error);
      }
    };

    if (userName) {
      fetchEquipos();
    }
  }, [userName]);

  const onAgregarJugador = (equipo) => {
    // Aquí va la lógica para agregar un jugador al equipo
  };

  const onVerJugadores = (equipoId) => {
    // Aquí va la lógica para ver los jugadores del equipo
  };

  const onEliminarEquipo = (equipoId) => {
    // Aquí va la lógica para eliminar el equipo
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
      Mis Equipos
    </Typography>
    <EquipoTable
      equipos={equipos}
      onAgregarJugador={onAgregarJugador}
      onVerJugadores={onVerJugadores}
      onEliminarEquipo={onEliminarEquipo}
    />
  </Box>
  );
};

export default Equipos;
