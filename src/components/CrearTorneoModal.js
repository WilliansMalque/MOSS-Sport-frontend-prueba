import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar } from '@mui/material';
import axios from 'axios';

const CrearTorneoModal = ({ open, onClose }) => {
  const [newTorneo, setNewTorneo] = useState({
    nombre: '',
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    lugar: '',
    estado: '',
    max_equipos: '',
    min_equipos: '',
    reglas: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTorneo({ ...newTorneo, [name]: value });
  };

  const handleCreateTorneo = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar que los campos no estén vacíos o con valores incorrectos
    if (
      !newTorneo.nombre ||
      !newTorneo.tipo ||
      !newTorneo.fecha_inicio ||
      !newTorneo.fecha_fin ||
      !newTorneo.lugar ||
      !newTorneo.estado ||
      !newTorneo.max_equipos ||
      !newTorneo.min_equipos ||
      !newTorneo.reglas
    ) {
      setLoading(false);
      setError('Por favor, complete todos los campos.');
      return;
    }

    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    if (newTorneo.fecha_inicio > newTorneo.fecha_fin) {
      setLoading(false);
      setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    // Validar que max_equipos >= min_equipos
    if (newTorneo.max_equipos < newTorneo.min_equipos) {
      setLoading(false);
      setError('El número máximo de equipos debe ser mayor o igual al número mínimo de equipos.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('No estás autenticado.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/torneos',
        newTorneo,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Si la creación es exitosa, mostramos el mensaje de éxito y cerramos el modal
      setSuccess('Torneo creado con éxito.');
      onClose();  // Cerramos el formulario después de crear el torneo

    } catch (error) {
      // Si ocurre un error, mostramos el mensaje de error
      setError('Hubo un error al crear el torneo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Nuevo Torneo</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="nombre"
          value={newTorneo.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tipo"
          name="tipo"
          value={newTorneo.tipo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Inicio"
          type="date"
          name="fecha_inicio"
          value={newTorneo.fecha_inicio}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de Fin"
          type="date"
          name="fecha_fin"
          value={newTorneo.fecha_fin}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Lugar"
          name="lugar"
          value={newTorneo.lugar}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Estado"
          name="estado"
          value={newTorneo.estado}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Máximo de Equipos"
          name="max_equipos"
          type="number"
          value={newTorneo.max_equipos}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mínimo de Equipos"
          name="min_equipos"
          type="number"
          value={newTorneo.min_equipos}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Reglas"
          name="reglas"
          value={newTorneo.reglas}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button 
          onClick={handleCreateTorneo} 
          color="primary" 
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear'}
        </Button>
      </DialogActions>

      {/* Mostrar mensaje de éxito o error */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || success}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Dialog>
  );
};

export default CrearTorneoModal;
