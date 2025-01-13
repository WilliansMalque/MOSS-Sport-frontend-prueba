import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const TablaPartidos = ({ titulo, partidos, equipos, torneos, onIniciarPartido, onFinalizarPartido, onEditarPartido, onEliminarPartido }) => {
  const [categoriasEquipos, setCategoriasEquipos] = useState([]);

  // Función para obtener las categorías y equipos de la API
  useEffect(() => {
    fetch('http://localhost:5000/api/categorias/categorias-torneos-equipos')
      .then((response) => response.json())
      .then((data) => {
        console.log('Categorías y equipos obtenidos:', data);
        setCategoriasEquipos(data);
      })
      .catch((error) => console.error('Error al obtener categorías y equipos:', error));
  }, []);

  // Función para obtener el nombre del equipo junto con su categoría
  const getEquipoNombreConCategoria = (id) => {
    const equipoCategoria = categoriasEquipos.find((item) => item.equipo_id === id);
    if (equipoCategoria) {
      return `${equipoCategoria.equipo} - ${equipoCategoria.categoria}`;
    }
    return 'Desconocido';
  };

  const getTorneoNombre = (id) => {
    if (!torneos || torneos.length === 0) {
      console.log('No hay torneos disponibles');
      return 'Desconocido';
    }
    const torneo = torneos.find((torneo) => torneo.id === id);
    return torneo ? torneo.nombre : 'Desconocido';
  };

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        {titulo}
      </Typography>
      {partidos.length === 0 ? (
        <Typography>No hay partidos en esta categoría.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo Local</TableCell>
                <TableCell>Equipo Visitante</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Lugar</TableCell>
                {titulo === 'Partidos Finalizados' && (
                  <>
                    <TableCell>Goles Local</TableCell>
                    <TableCell>Goles Visitante</TableCell>
                  </>
                )}
                {titulo === 'Partidos En Curso' && (
                  <>
                    <TableCell>Goles Local</TableCell>
                    <TableCell>Goles Visitante</TableCell>
                    <TableCell>Árbitro</TableCell>
                  </>
                )}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partidos.map((partido) => (
                <TableRow key={partido.id}>
                  <TableCell>{getEquipoNombreConCategoria(partido.equipo_local_id)}</TableCell>
                  <TableCell>{getEquipoNombreConCategoria(partido.equipo_visitante_id)}</TableCell>
                  <TableCell>{new Date(partido.fecha_hora).toLocaleString()}</TableCell>
                  <TableCell>{partido.lugar}</TableCell>
                  {titulo === 'Partidos Finalizados' && (
                    <>
                      <TableCell>{partido.goles_local}</TableCell>
                      <TableCell>{partido.goles_visitante}</TableCell>
                    </>
                  )}
                  {titulo === 'Partidos En Curso' && (
                    <>
                      <TableCell>{partido.goles_local}</TableCell>
                      <TableCell>{partido.goles_visitante}</TableCell>
                      <TableCell>{partido.arbitro}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {titulo === 'Partidos Programados' && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onIniciarPartido(partido)}
                      >
                        Iniciar Partido
                      </Button>
                    )}
                    {titulo === 'Partidos En Curso' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => onFinalizarPartido(partido)}
                        sx={{ marginLeft: 1 }}
                      >
                        Finalizar Partido
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onEditarPartido(partido)}
                      sx={{ marginLeft: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onEliminarPartido(partido.id)}
                      sx={{ marginLeft: 1 }}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TablaPartidos;
