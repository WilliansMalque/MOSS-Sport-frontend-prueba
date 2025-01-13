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

    // Cargar datos iniciales
    useEffect(() => {
      console.log('[INFO] Cargando datos iniciales...');
      
      axios.get('http://localhost:5000/api/partidos')
        .then((response) => {
          console.log('[DATA] Partidos obtenidos:', response.data);
          setPartidos(response.data);
        })
        .catch((error) => {
          console.error('[ERROR] Error al obtener los partidos:', error);
        });

      axios.get('http://localhost:5000/api/equipos/categorias')
        .then((response) => {
          console.log('[DATA] Equipos obtenidos:', response.data);
          setEquipos(response.data);
        })
        .catch((error) => {
          console.error('[ERROR] Error al obtener los equipos:', error);
        });
  
      axios.get('http://localhost:5000/api/torneos')
        .then((response) => {
          console.log('[DATA] Torneos obtenidos:', response.data);
          setTorneos(response.data);
        })
        .catch((error) => {
          console.error('[ERROR] Error al obtener los torneos:', error);
        });
    }, []);

    // Manejar selección de torneo
    const handleTorneoChange = (torneoId) => {
      console.log('[EVENT] Torneo seleccionado:', torneoId);
      
      // Actualizar estado del partido
      setNuevoPartido((prev) => ({ ...prev, torneo_id: torneoId }));
      
      // Buscar el torneo seleccionado
      const torneoSeleccionado = torneos.find((torneo) => torneo.id === parseInt(torneoId));
      console.log('[DATA] Torneo seleccionado:', torneoSeleccionado);

      const nombreTorneo = torneoSeleccionado?.nombre || '';
      console.log('[INFO] Filtrando equipos para el torneo:', nombreTorneo);

      // Filtrar equipos asociados al torneo
      const equiposEnTorneo = equipos.filter((equipo) => equipo.torneo_nombre === nombreTorneo);
      console.log('[DATA] Equipos filtrados:', equiposEnTorneo);

      setEquiposFiltrados(equiposEnTorneo);
    };

    // Manejar creación del partido
    const handleAddPartido = () => {
      console.log('[INFO] Datos del nuevo partido:', nuevoPartido);
      
      axios.post('http://localhost:5000/api/partidos', nuevoPartido)
        .then((response) => {
          console.log('[SUCCESS] Partido creado:', response.data);
          setPartidos([...partidos, response.data]);
          onCreate(response.data);
          onClose();
          // Resetear formulario
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
          console.error('[ERROR] Error al agregar el partido:', error);
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
            <InputLabel>Disciplina</InputLabel>
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
          
          <FormControl fullWidth margin="normal" disabled={!equiposFiltrados.length}>
  <InputLabel>Equipo Local</InputLabel>
  <Select
    value={nuevoPartido.equipo_local_id}
    onChange={(e) => {
      const equipoSeleccionado = equiposFiltrados.find((equipo) => equipo.equipo_id === parseInt(e.target.value));
      console.log('[INFO] Equipo Local seleccionado:', equipoSeleccionado);
      setNuevoPartido((prev) => ({ ...prev, equipo_local_id: e.target.value }));
    }}
  >
    {equiposFiltrados.map((equipo) => (
      <MenuItem key={equipo.equipo_id} value={equipo.equipo_id}>
        {equipo.equipo_nombre} - {equipo.categoria_nombre}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl fullWidth margin="normal" disabled={!equiposFiltrados.length}>
  <InputLabel>Equipo Visitante</InputLabel>
  <Select
    value={nuevoPartido.equipo_visitante_id}
    onChange={(e) => {
      const equipoSeleccionado = equiposFiltrados.find((equipo) => equipo.equipo_id === parseInt(e.target.value));
      console.log('[INFO] Equipo Visitante seleccionado:', equipoSeleccionado);
      setNuevoPartido((prev) => ({ ...prev, equipo_visitante_id: e.target.value }));
    }}
  >
    {equiposFiltrados.map((equipo) => (
      <MenuItem key={equipo.equipo_id} value={equipo.equipo_id}>
        {equipo.equipo_nombre} - {equipo.categoria_nombre}
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
