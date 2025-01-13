import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';

const TestPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [torneosFiltrados, setTorneosFiltrados] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [torneosSeleccionados, setTorneosSeleccionados] = useState([]);
  const [formData, setFormData] = useState({
    nombreEquipo: '',
    email: '',
  });
  const [open, setOpen] = useState(false); // Estado para controlar la apertura del dialog

  // Cargar categorías y torneos
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categorias/categorias-torneos');
        console.log('Datos recibidos desde el backend (categorías y torneos):', response.data);

        const categoriasConTorneos = response.data.reduce((acc, item) => {
          const categoriaExistente = acc.find((cat) => cat.categoria_id === item.categoria_id);
          if (categoriaExistente) {
            categoriaExistente.torneos.push({
              torneo_id: item.torneo_id,
              torneo_nombre: item.torneo_nombre,
              categoria_nombre: item.categoria_nombre,
            });
          } else {
            acc.push({
              categoria_id: item.categoria_id,
              categoria_nombre: item.categoria_nombre,
              torneos: [
                {
                  torneo_id: item.torneo_id,
                  torneo_nombre: item.torneo_nombre,
                  categoria_nombre: item.categoria_nombre,
                },
              ],
            });
          }
          return acc;
        }, []);

        setCategorias(categoriasConTorneos);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar selección de categorías
  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((item) => item !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  // Manejar la actualización de los torneos filtrados
  useEffect(() => {
    const torneosDeCategoriasSeleccionadas = categorias
      .filter((cat) => categoriasSeleccionadas.includes(cat.categoria_id.toString()))
      .flatMap((cat) => cat.torneos);

    setTorneosFiltrados(torneosDeCategoriasSeleccionadas);
  }, [categoriasSeleccionadas, categorias]);

  // Manejar selección de torneos
  const handleTorneoChange = (e) => {
    const torneoId = e.target.value;
    setTorneosSeleccionados((prev) =>
      prev.includes(torneoId)
        ? prev.filter((item) => item !== torneoId)
        : [...prev, torneoId]
    );
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar datos para enviar
    const equiposData = {
      nombre: formData.nombreEquipo,
      email_capitan: formData.email,
      torneos: torneosSeleccionados.map((torneoId) => {
        return categorias
          .filter((cat) => categoriasSeleccionadas.includes(cat.categoria_id.toString()))
          .flatMap((cat) => {
            return cat.torneos
              .filter((torneo) => torneo.torneo_id.toString() === torneoId)
              .map((torneo) => ({
                torneo_id: torneo.torneo_id,
                categoria_id: cat.categoria_id,
              }));
          });
      }).flat(),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/equipos', equiposData);
      console.log('Equipo agregado con éxito:', response.data);
      setOpen(false); // Cerrar el dialog después de enviar el formulario
    } catch (error) {
      console.error('Error al agregar el equipo:', error);
    }
  };

  // Manejar la apertura y cierre del diálogo
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Agregar Equipo
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Equipo</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre del Equipo"
              name="nombreEquipo"
              value={formData.nombreEquipo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email del Capitán"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              fullWidth
              margin="normal"
              required
            />

            <div>
              <h4>Categorías</h4>
              {categorias.map((cat) => (
                <FormControlLabel
                  key={cat.categoria_id}
                  control={
                    <Checkbox
                      value={cat.categoria_id}
                      onChange={handleCategoriaChange}
                      checked={categoriasSeleccionadas.includes(cat.categoria_id.toString())}
                    />
                  }
                  label={cat.categoria_nombre}
                />
              ))}
            </div>

            <div>
              <h4>Torneos</h4>
              {torneosFiltrados.length > 0 ? (
                torneosFiltrados.map((torneo) => (
                  <FormControlLabel
                    key={torneo.torneo_id}
                    control={
                      <Checkbox
                        value={torneo.torneo_id}
                        onChange={handleTorneoChange}
                        checked={torneosSeleccionados.includes(torneo.torneo_id.toString())}
                      />
                    }
                    label={`${torneo.torneo_nombre} - ${torneo.categoria_nombre}`}
                  />
                ))
              ) : (
                <p>No hay torneos disponibles para las categorías seleccionadas.</p>
              )}
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} color="primary">
            Agregar Equipo
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TestPage;
