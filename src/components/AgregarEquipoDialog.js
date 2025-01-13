import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import axios from 'axios';

const AgregarEquipoDialog = ({ open, onClose, setNuevoEquipo, onAgregarEquipo }) => {
  const [categorias, setCategorias] = useState([]);
  const [torneosFiltrados, setTorneosFiltrados] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [torneosSeleccionados, setTorneosSeleccionados] = useState([]);
  const [formData, setFormData] = useState({
    nombreEquipo: '',
    email: '',
  });

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
      onClose(); // Cerrar el diálogo después de enviar el formulario
      setFormData({ nombreEquipo: '', email: '' }); // Limpiar el formulario
      setCategoriasSeleccionadas([]);
      setTorneosSeleccionados([]);
    } catch (error) {
      console.error('Error al agregar el equipo:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button
          onClick={() => {
            const allCategoriaIds = categorias.map((cat) => cat.categoria_id.toString());
            setCategoriasSeleccionadas(allCategoriaIds); // Seleccionar todas las categorías
          }}
        >
          Seleccionar Todo
        </Button>
        <Button
          onClick={() => {
            setCategoriasSeleccionadas([]); // Deseleccionar todas las categorías
          }}
        >
          Deseleccionar Todo
        </Button>
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
        <Button
          onClick={() => {
            const allTorneoIds = torneosFiltrados.map((torneo) => torneo.torneo_id.toString());
            setTorneosSeleccionados(allTorneoIds); // Seleccionar todos los torneos
          }}
        >
          Seleccionar Todo
        </Button>
        <Button
          onClick={() => {
            setTorneosSeleccionados([]); // Deseleccionar todos los torneos
          }}
        >
          Deseleccionar Todo
        </Button>
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

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button type="submit" color="primary">
          Agregar Equipo
        </Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>

  );
};

export default AgregarEquipoDialog;
