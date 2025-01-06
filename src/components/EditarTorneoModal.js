import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar } from '@mui/material';
import axios from 'axios';

const EditarTorneoModal = ({ open, onClose, torneoId, onUpdate }) => {
  const [torneo, setTorneo] = useState({
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

  // Cargar los datos del torneo cuando el modal se abre
  useEffect(() => {
    if (open && torneoId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/torneos/${torneoId}`)
        .then(response => {
          setTorneo(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Hubo un error al cargar los datos del torneo.');
          setLoading(false);
        });
    }
  }, [open, torneoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTorneo({ ...torneo, [name]: value });
  };

  const handleUpdateTorneo = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar que los campos no estén vacíos o con valores incorrectos
    if (
      !torneo.nombre ||
      !torneo.tipo ||
      !torneo.fecha_inicio ||
      !torneo.fecha_fin ||
      !torneo.lugar ||
      !torneo.estado ||
      !torneo.max_equipos ||
      !torneo.min_equipos ||
      !torneo.reglas
    ) {
      setLoading(false);
      setError('Por favor, complete todos los campos.');
      return;
    }

    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    if (torneo.fecha_inicio > torneo.fecha_fin) {
      setLoading(false);
      setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    // Validar que max_equipos >= min_equipos
    if (torneo.max_equipos < torneo.min_equipos) {
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

      const response = await axios.put(
        `http://localhost:5000/api/torneos/${torneoId}`,
        torneo,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Si la actualización es exitosa, mostramos el mensaje de éxito y cerramos el modal
      setSuccess('Torneo actualizado con éxito.');
      onUpdate(response.data);  // Llamamos a la función onUpdate pasada por props para actualizar el estado en el componente principal
      onClose();  // Cerramos el formulario después de actualizar el torneo

    } catch (error) {
      // Si ocurre un error, mostramos el mensaje de error
      setError('Hubo un error al actualizar el torneo. Intenta nuevamente.');
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
      <DialogTitle>Editar Torneo</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="nombre"
          value={torneo.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tipo"
          name="tipo"
          value={torneo.tipo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Inicio"
          type="date"
          name="fecha_inicio"
          value={torneo.fecha_inicio}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de Fin"
          type="date"
          name="fecha_fin"
          value={torneo.fecha_fin}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Lugar"
          name="lugar"
          value={torneo.lugar}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Estado"
          name="estado"
          value={torneo.estado}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Máximo de Equipos"
          name="max_equipos"
          type="number"
          value={torneo.max_equipos}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mínimo de Equipos"
          name="min_equipos"
          type="number"
          value={torneo.min_equipos}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Reglas"
          name="reglas"
          value={torneo.reglas}
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
          onClick={handleUpdateTorneo} 
          color="primary" 
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
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

export default EditarTorneoModal;
