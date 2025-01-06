import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';

const JugadoresDialog = ({ jugadores, equipoSeleccionado, onClose, onActualizarJugador, onEliminarJugador }) => {
  const [jugadorEditado, setJugadorEditado] = useState(null);

  const handleEditarJugador = (jugador) => {
    setJugadorEditado({ ...jugador });
  };

  const handleEliminarJugador = async (jugadorId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jugadores/${jugadorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el jugador');
      }

      if (response.status === 200) {
        alert('Jugador eliminado con éxito');
        onEliminarJugador(jugadorId); // Llama la función para actualizar la lista
      } else {
        throw new Error('Error desconocido');
      }
    } catch (error) {
      console.error('Error de eliminación:', error);
      alert('Hubo un error al eliminar el jugador. Por favor, intente de nuevo.');
    }
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJugadorEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmarEdicion = async () => {
    if (jugadorEditado) {
      if (!jugadorEditado.nombre || !jugadorEditado.edad || !jugadorEditado.posicion || !jugadorEditado.numero_camiseta) {
        alert('Todos los campos son obligatorios');
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/api/jugadores/${jugadorEditado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: jugadorEditado.nombre,
            edad: jugadorEditado.edad,
            posicion: jugadorEditado.posicion,
            numero_camiseta: jugadorEditado.numero_camiseta,
            equipo_id: jugadorEditado.equipo_id,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el jugador');
        }

        const data = await response.json();

        // Llama a la función onActualizarJugador para actualizar el estado
        onActualizarJugador(data);

        setJugadorEditado(null);
        onClose(); // Cierra el diálogo
      } catch (error) {
        console.error('Error de actualización:', error);
        alert('Hubo un error al actualizar el jugador. Por favor, intente de nuevo.');
      }
    }
  };

  return (
    <Dialog open={jugadores.length > 0} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>
        Jugadores de {equipoSeleccionado?.nombre_equipo}
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell align="center"><strong>Nombre</strong></TableCell>
                <TableCell align="center"><strong>Edad</strong></TableCell>
                <TableCell align="center"><strong>Posición</strong></TableCell>
                <TableCell align="center"><strong>Número de Camiseta</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jugadores.map((jugador) => (
                <TableRow key={jugador.id}>
                  <TableCell align="center">{jugador.nombre}</TableCell>
                  <TableCell align="center">{jugador.edad}</TableCell>
                  <TableCell align="center">{jugador.posicion}</TableCell>
                  <TableCell align="center">{jugador.numero_camiseta}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEditarJugador(jugador)}
                    >
                      Actualizar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ marginLeft: 1 }}
                      onClick={() => handleEliminarJugador(jugador.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {jugadorEditado && (
          <div style={{ marginTop: '20px' }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={jugadorEditado.nombre}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Edad"
              name="edad"
              value={jugadorEditado.edad}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Posición"
              name="posicion"
              value={jugadorEditado.posicion}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Número de Camiseta"
              name="numero_camiseta"
              value={jugadorEditado.numero_camiseta}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmarEdicion}
              sx={{ marginTop: 2 }}
            >
              Guardar Cambios
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" sx={{ fontWeight: 'bold' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JugadoresDialog;
