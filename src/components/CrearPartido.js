import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Button, Modal, TextField, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';

const CrearPartido = ({ open, onClose, onCreate }) => {
    const [partidos, setPartidos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [torneos, setTorneos] = useState([]);
    const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  
    const [nuevoPartido, setNuevoPartido] = useState({
      torneo_id: '',
      equipo_local_id: '',
      equipo_visitante_id: '',
      fecha_hora: '',
      lugar: '',
      estado: 'programado',
      goles_local: null,
      goles_visitante: null,
      arbitro: '',
    });

    useEffect(() => {
      // Obtener los partidos
      axios.get('http://localhost:5000/api/partidos')
        .then((response) => {
          setPartidos(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener los partidos', error);
        });
      
      // Obtener los equipos
      axios.get('http://localhost:5000/api/equipos')
        .then((response) => {
          setEquipos(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener los equipos', error);
        });
  
      // Obtener los torneos
      axios.get('http://localhost:5000/api/torneos')
        .then((response) => {
          setTorneos(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener los torneos', error);
        });
    }, []);

    // Manejar la selección de un torneo para filtrar equipos
    const handleTorneoChange = (torneoId) => {
      setNuevoPartido((prev) => ({ ...prev, torneo_id: torneoId }));
      // Filtrar equipos inscritos en el torneo seleccionado
      const equiposEnTorneo = equipos.filter((equipo) => equipo.torneo_id === parseInt(torneoId));
      setEquiposFiltrados(equiposEnTorneo);
    };

    const handleAddPartido = () => {
      axios.post('http://localhost:5000/api/partidos', nuevoPartido)
        .then((response) => {
          setPartidos([...partidos, response.data]);
          onCreate(response.data);  // Llamar a la función onCreate del padre si es necesario
          onClose();  // Cerrar el modal
          setNuevoPartido({
            torneo_id: '',
            equipo_local_id: '',
            equipo_visitante_id: '',
            fecha_hora: '',
            lugar: '',
            estado: 'programado',
            goles_local: null,
            goles_visitante: null,
            arbitro: '',
          });
        })
        .catch((error) => {
          console.error('Error al agregar el partido', error);
        });
    };

  return (
    <Modal open={open} onClose={onClose}>
      <Box 
                sx={{
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Nuevo Partido
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Torneo</InputLabel>
                  <Select
                    value={nuevoPartido.torneo_id}
                    onChange={(e) => handleTorneoChange(e.target.value)}
                  >
                    {torneos.map((torneo) => (
                      <MenuItem key={torneo.id} value={torneo.id}>
                        {torneo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Equipo Local</InputLabel>
                  <Select
                    value={nuevoPartido.equipo_local_id}
                    onChange={(e) => setNuevoPartido((prev) => ({ ...prev, equipo_local_id: e.target.value }))}
                    disabled={!nuevoPartido.torneo_id}
                  >
                    {equiposFiltrados.map((equipo) => (
                      <MenuItem key={equipo.id} value={equipo.id}>
                        {equipo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Equipo Visitante</InputLabel>
                  <Select
                    value={nuevoPartido.equipo_visitante_id}
                    onChange={(e) => setNuevoPartido((prev) => ({ ...prev, equipo_visitante_id: e.target.value }))}
                    disabled={!nuevoPartido.torneo_id}
                  >
                    {equiposFiltrados.map((equipo) => (
                      <MenuItem key={equipo.id} value={equipo.id}>
                        {equipo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Fecha y Hora"
                  type="datetime-local"
                  value={nuevoPartido.fecha_hora}
                  onChange={(e) => setNuevoPartido((prev) => ({ ...prev, fecha_hora: e.target.value }))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Lugar"
                  value={nuevoPartido.lugar}
                  onChange={(e) => setNuevoPartido((prev) => ({ ...prev, lugar: e.target.value }))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Árbitro"
                  value={nuevoPartido.arbitro}
                  onChange={(e) => setNuevoPartido((prev) => ({ ...prev, arbitro: e.target.value }))}
                  margin="normal"
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddPartido}
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Guardar
                </Button>
              </Box>
    </Modal>
  );
};

export default CrearPartido;
