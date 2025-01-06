import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const AgregarJugadorDialog = ({ open, onClose, equipoSeleccionado, jugadorNombre, jugadorEdad, jugadorPosicion, jugadorNumeroCamiseta, setJugadorNombre, setJugadorEdad, setJugadorPosicion, setJugadorNumeroCamiseta, onAgregarJugador }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>
        Agregar Jugador a {equipoSeleccionado?.nombre_equipo}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre del Jugador"
          type="text"
          fullWidth
          variant="outlined"
          value={jugadorNombre}
          onChange={(e) => setJugadorNombre(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          margin="dense"
          label="Edad"
          type="number"
          fullWidth
          variant="outlined"
          value={jugadorEdad}
          onChange={(e) => setJugadorEdad(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          margin="dense"
          label="Posición"
          type="text"
          fullWidth
          variant="outlined"
          value={jugadorPosicion}
          onChange={(e) => setJugadorPosicion(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          margin="dense"
          label="Número de Camiseta"
          type="number"
          fullWidth
          variant="outlined"
          value={jugadorNumeroCamiseta}
          onChange={(e) => setJugadorNumeroCamiseta(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" sx={{ fontWeight: 'bold' }}>
          Cancelar
        </Button>
        <Button onClick={onAgregarJugador} color="primary" sx={{ fontWeight: 'bold' }}>
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgregarJugadorDialog;
