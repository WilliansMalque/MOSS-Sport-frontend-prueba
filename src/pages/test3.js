import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Divider, Box, Button, Modal, TextField, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';

const PartidosList = () => {
  const [partidos, setPartidos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  


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


  //----

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [partidoActual, setPartidoActual] = useState(null);
    const [actualizacionPartido, setActualizacionPartido] = useState({
      goles_local: '',
      goles_visitante: '',
      estado: 'finalizado',
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
        setModalOpen(false);
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

  const getEquipoNombre = (id) => {
    const equipo = equipos.find(equipo => equipo.id === id);
    return equipo ? equipo.nombre : 'Desconocido';
  };

  //--------

  const abrirModalActualizar = (partido) => {
    setPartidoActual(partido);
    setActualizacionPartido({
      goles_local: partido.goles_local || '',
      goles_visitante: partido.goles_visitante || '',
      estado: 'finalizado',
    });
    setModalUpdateOpen(true);
  };

  const handleUpdatePartido = () => {
    axios
      .put(`http://localhost:5000/api/partidos/${partidoActual.id}`, actualizacionPartido)
      .then((response) => {
        // Actualizar la lista de partidos con la respuesta actualizada
        setPartidos((prevPartidos) =>
          prevPartidos.map((partido) =>
            partido.id === partidoActual.id ? response.data : partido
          )
        );
        setModalUpdateOpen(false);
        setPartidoActual(null);
      })
      .catch((error) => {
        console.error('Error al actualizar el partido', error);
      });
  };
  

  // Filtrar partidos programados y finalizados
  const partidosProgramados = partidos.filter((partido) => partido.estado === 'programado');
  const partidosFinalizados = partidos.filter((partido) => partido.estado === 'finalizado');



  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Partidos
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setModalOpen(true)} 
        sx={{ marginBottom: 3 }}
      >
        Agregar Partido
      </Button>

      {/* Modal para agregar un partido */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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

      {/* Sección de partidos programados */}
      <Typography variant="h5" gutterBottom>
        Programados
      </Typography>
      {partidosProgramados.length === 0 ? (
        <Typography>No hay partidos programados.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo Local</TableCell>
                <TableCell>Equipo Visitante</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Arbitro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partidosProgramados.map((partido) => (
                <TableRow key={partido.id}>
                  <TableCell>{getEquipoNombre(partido.equipo_local_id)}</TableCell>
                  <TableCell>{getEquipoNombre(partido.equipo_visitante_id)}</TableCell>
                  <TableCell>{new Date(partido.fecha_hora).toLocaleString()}</TableCell>
                  <TableCell>{partido.lugar}</TableCell>
                  <TableCell>{partido.arbitro}</TableCell>
                  <TableCell>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => abrirModalActualizar(partido)}
                                      >
                                        Finalizar
                                      </Button>
                                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Divider sx={{ margin: '20px 0' }} />

      {/* Sección de partidos finalizados */}
      <Typography variant="h5" gutterBottom>
        Finalizados
      </Typography>
      {partidosFinalizados.length === 0 ? (
        <Typography>No hay partidos finalizados.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo Local</TableCell>
                <TableCell>Equipo Visitante</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Goles Local</TableCell>
                <TableCell>Goles Visitante</TableCell>
                <TableCell>Arbitro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partidosFinalizados.map((partido) => (
                <TableRow key={partido.id}>
                  <TableCell>{getEquipoNombre(partido.equipo_local_id)}</TableCell>
                  <TableCell>{getEquipoNombre(partido.equipo_visitante_id)}</TableCell>
                  <TableCell>{new Date(partido.fecha_hora).toLocaleString()}</TableCell>
                  <TableCell>{partido.lugar}</TableCell>
                  <TableCell>{partido.goles_local}</TableCell>
                  <TableCell>{partido.goles_visitante}</TableCell>
                  <TableCell>{partido.arbitro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      
    </Box>
  );
};

export default PartidosList;
