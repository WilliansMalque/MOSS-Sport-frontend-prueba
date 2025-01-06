import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AgregarEquipoDialog = ({ open, onClose, nuevoEquipo, setNuevoEquipo, onAgregarEquipo }) => {
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/torneos');
        const torneosPendientes = response.data.filter(torneo => torneo.estado === 'pendiente');
        setTorneos(torneosPendientes);
      } catch (error) {
        console.error('Error al obtener los torneos:', error);
      }
    };
    fetchTorneos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEquipo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTorneoChange = (e) => {
    const { value } = e.target;
    setNuevoEquipo((prev) => ({
      ...prev,
      nombre_torneo: value,
    }));
  };

  const handleAgregarEquipo = async () => {
    if (!nuevoEquipo.nombre || !nuevoEquipo.email_capitan || !nuevoEquipo.nombre_torneo) {
      alert('Por favor complete todos los campos.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/equipos', {
        nombre: nuevoEquipo.nombre,
        email_capitan: nuevoEquipo.email_capitan,
        nombre_torneo: nuevoEquipo.nombre_torneo
      });
      onAgregarEquipo();
      onClose();
    } catch (error) {
      console.error('Error al agregar equipo:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre del equipo"
          type="text"
          fullWidth
          variant="outlined"
          name="nombre"
          value={nuevoEquipo.nombre}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Email del Capitán"
          type="email"
          fullWidth
          variant="outlined"
          name="email_capitan"
          value={nuevoEquipo.email_capitan}
          onChange={handleInputChange}
        />
        
        {/* Selección del torneo pendiente */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Seleccionar Torneo</InputLabel>
          <Select
            value={nuevoEquipo.nombre_torneo || ''}
            onChange={handleTorneoChange}
            name="nombre_torneo"
            label="Seleccionar Torneo"
          >
            {torneos.map((torneo) => (
              <MenuItem key={torneo.id} value={torneo.nombre}>
                {torneo.nombre} - {torneo.lugar} ({torneo.fecha_inicio.split("T")[0]} a {torneo.fecha_fin.split("T")[0]})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAgregarEquipo} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgregarEquipoDialog;
