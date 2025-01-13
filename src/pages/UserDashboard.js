import React, { useEffect, useState } from 'react';
import { IconButton,Box, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper } from '@mui/material';
import { SportsSoccer, BarChart, Group, EmojiEvents } from '@mui/icons-material';
import axios from 'axios';
import CrearTorneoModal from '../components/CrearTorneoModal';
import EditarTorneoModal from '../components/EditarTorneoModal';
import EliminarTorneoModal from '../components/EliminarTorneoModal'; // Importamos el modal de eliminación
import DetallesTorneoModal from '../components/DetallesTorneoModal'; // Importamos el modal de detalles
import TablaPosiciones from '../components/TablaPosiciones'; // Importamos el componente TablaPosiciones

import { createTheme, ThemeProvider } from '@mui/material/styles';
import EquipoTable from '../components/EquipoTableUser'; 
import AgregarJugadorDialog from '../components/AgregarJugadorDialog';
import JugadoresDialog from '../components/JugadoresDialog';
import AgregarEquipoDialog from '../components/AgregarEquipoDialog'; // Importar el componente para agregar equipo


//-----
import FinalizarPartido from '../components/FinalizarPartido'; // Importar el nuevo componente
import CrearPartido from '../components/CrearPartido'; // Importar el nuevo componente
import TablaPartidos from '../components/TablaPartidosUser'; // Importa el componente TablaPartidos
import EditarPartido from '../components/EditarPartido';


const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('Estadísticas');
  const [stats, setStats] = useState(null);
  const [torneos, setTorneos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false); // Estado para abrir el modal de crear torneo
  const [openEditModal, setOpenEditModal] = useState(false);  // Estado para abrir el modal de editar torneo
  const [selectedTorneoId, setSelectedTorneoId] = useState(null); // ID del torneo seleccionado para editar
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Estado para abrir el modal de eliminación
  const [torneoToDelete, setTorneoToDelete] = useState(null); // ID del torneo que se va a eliminar
  const [openDetailsModal, setOpenDetailsModal] = useState(false); // Estado para abrir el modal de detalles
  const [torneoToView, setTorneoToView] = useState(null); // ID del torneo a ver detalles
  const [posiciones, setPosiciones] = useState([]); // Estado para las posiciones
  const [selectedTorneo, setSelectedTorneo] = useState(null); // Torneo seleccionado
  const [showPosiciones, setShowPosiciones] = useState(false); // Estado para mostrar/ocultar la tabla de posiciones
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [partidoActual, setPartidoActual] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalFinalizarOpen, setModalFinalizarOpen] = useState(false);
    const [editPartido, setEditPartido] = useState(null);
    const [open, setOpen] = useState(false);
    

    
    


    const [openDialog, setOpenDialog] = useState(false);
    const [jugadorNombre, setJugadorNombre] = useState('');
    const [jugadorEdad, setJugadorEdad] = useState('');
    const [jugadorPosicion, setJugadorPosicion] = useState('');
    const [jugadorNumeroCamiseta, setJugadorNumeroCamiseta] = useState('');
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
    
    const [jugadores, setJugadores] = useState([]);


    const [userName, setUserName] = useState('');
    


    // Estado para agregar un equipo
     const [openDialogEquipo, setOpenDialogEquipo] = useState(false);
     const [nuevoEquipo, setNuevoEquipo] = useState({
       nombre: '',
       email_capitan: '',
       nombre_torneo: ''
     });

     


  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get('http://localhost:5000/api/torneos/estadisticas');
        const torneosResponse = await axios.get('http://localhost:5000/api/torneos');
        const equiposResponse = await axios.get('http://localhost:5000/api/equipos');
        const partidosResponse = await axios.get('http://localhost:5000/api/partidos');
        const equipoDetResponse = await axios.get('http://localhost:5000/api/equipos/detalles');
        
        
        setStats(statsResponse.data);
        setTorneos(torneosResponse.data);
        setPartidos(partidosResponse.data);
        setEquipos(equipoDetResponse.data);
        
        
        
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
      
      
    };

    fetchData();
  }, []);

  const equiposFiltrados = equipos.filter((equipo) => equipo.nombre_capitan === userName);

  //
  // Obtener los equipos desde la API
  useEffect(() => {
    // Obtener el nombre del usuario logueado desde localStorage o decodificar el token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserName(decodedToken.nombre); // Establecer el nombre del usuario logueado
    }
  }, []);
  

  const onAgregarJugador = (equipo) => {
    // Aquí va la lógica para agregar un jugador al equipo
  };

  const onVerJugadores = (equipoId) => {
    // Aquí va la lógica para ver los jugadores del equipo
  };

  const onEliminarEquipo = (equipoId) => {
    // Aquí va la lógica para eliminar el equipo
  };

  

  // Modifica getEquipoNombre para usar los campos correctos
  const getEquipoNombre = (id) => {
    // Aquí buscamos el equipo utilizando el id que viene como equipo_id en la respuesta
    const equipo = equipos.find((equipo) => equipo.equipo_id === id);
    return equipo ? equipo.nombre_equipo : 'Desconocido'; // Usamos nombre_equipo
  };
  

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleOpenEditModal = (torneoId) => {
    setSelectedTorneoId(torneoId);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedTorneoId(null);
  };

  const handleUpdateTorneo = (updatedTorneo) => {
    setTorneos((prevTorneos) =>
      prevTorneos.map((torneo) =>
        torneo.id === updatedTorneo.id ? updatedTorneo : torneo
      )
    );
  };

  const handleOpenDeleteModal = (torneoId) => {
    setTorneoToDelete(torneoId);
    setOpenDeleteModal(true);
  };

  const handleDeleteTorneo = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/torneos/${torneoToDelete}`);
      setTorneos(torneos.filter((torneo) => torneo.id !== torneoToDelete));
      setOpenDeleteModal(false);
      setTorneoToDelete(null);
    } catch (error) {
      console.error('Error al eliminar el torneo:', error);
    }
  };

  const handleOpenDetailsModal = (torneoId) => {
    setTorneoToView(torneoId);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setTorneoToView(null);
  };

  // Función para obtener la tabla de posiciones de un torneo
  const fetchPosiciones = async (idTorneo) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/torneos/${idTorneo}/posiciones`);
      setPosiciones(response.data);
    } catch (error) {
      console.error('Error al obtener posiciones:', error);
    }
  };

  const handleTorneoSelect = (torneo) => {
    setSelectedTorneo(torneo);
    setShowPosiciones(false); // Reseteamos la visibilidad de las posiciones antes de obtener nuevas
    fetchPosiciones(torneo.id); // Cargamos las posiciones del torneo
  };

  const togglePosiciones = () => {
    setShowPosiciones(!showPosiciones);
  };


  //------
  const handleAbrirFormulario = (equipo) => {
    setEquipoSeleccionado(equipo);
    setOpenDialog(true);
  };

  const handleCerrarFormulario = () => {
    setOpenDialog(false);
    setJugadorNombre('');
    setJugadorEdad('');
    setJugadorPosicion('');
    setJugadorNumeroCamiseta('');
  };

  const handleAgregarJugador = async () => {
    if (!jugadorNombre || !jugadorEdad || !jugadorPosicion || !jugadorNumeroCamiseta) {
      alert('Por favor complete todos los campos.');
      return;
    }

    try {
      const newJugador = {
        nombre: jugadorNombre,
        edad: jugadorEdad,
        posicion: jugadorPosicion,
        numero_camiseta: jugadorNumeroCamiseta,
        equipo_id: equipoSeleccionado.equipo_id,
      };

      await axios.post('http://localhost:5000/api/jugadores', newJugador);
      handleCerrarFormulario();

      const response = await axios.get('http://localhost:5000/api/equipos/detalles');
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al agregar jugador:', error);
    }
  };
  

  const handleVerJugadores = async (equipoId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/jugadores');
      const jugadoresEquipo = response.data.filter(jugador => jugador.equipo_id === equipoId);
      setJugadores(jugadoresEquipo);
      setEquipoSeleccionado(equipos.find(equipo => equipo.equipo_id === equipoId));  // Seteamos el equipo seleccionado
      
    } catch (error) {
      console.error('Error al obtener los jugadores:', error);
    }
  };

  //------Actualizar jugador

  // Función para manejar la actualización de un jugador
  const handleActualizarJugador = (jugadorActualizado) => {
    // Actualiza la lista de jugadores en el estado con el jugador actualizado
    setJugadores((prevJugadores) =>
      prevJugadores.map((jugador) =>
        jugador.id === jugadorActualizado.id ? jugadorActualizado : jugador
      )
    );
  };

  //eliminar jugador

  // Función para manejar la eliminación de jugadores
  const handleEliminarJugador = (jugadorId) => {
    setJugadores(jugadores.filter((jugador) => jugador.id !== jugadorId)); // Elimina el jugador de la lista local
  };

  


  //------------------
  
  const handleAbrirFormularioEquipo = () => {
    setOpenDialogEquipo(true);
  };

  const handleCerrarFormularioEquipo = () => {
    setOpenDialogEquipo(false);
    setNuevoEquipo({
      nombre: '',
      email_capitan: '',
      nombre_torneo: ''
    });
  };

  const handleAgregarEquipo = async () => {
    if (!nuevoEquipo.nombre || !nuevoEquipo.email_capitan || !nuevoEquipo.nombre_torneo) {
      alert('Por favor complete todos los campos.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/equipos', nuevoEquipo);
      handleCerrarFormularioEquipo();
      
    } catch (error) {
      console.error('Error al agregar equipo:', error);
    }
  };

  //-------
  

  // Dividir los partidos por su estado
  const partidosProgramados = partidos.filter((p) => p.estado === 'programado');
  const partidosEnCurso = partidos.filter((p) => p.estado === 'en curso');
  const partidosFinalizados = partidos.filter((p) => p.estado === 'finalizado');

   // Función para mostrar el formulario de editar partido
   const handleEditarPartido = (partido) => {
    setPartidoActual(partido);
    setModalEditarOpen(true);
  };

  // Función para mostrar el formulario de finalizar partido
  const handleFinalizarPartido = (partido) => {
    setPartidoActual(partido);
    setModalFinalizarOpen(true);
  };

  // Función para iniciar un partido y cambiar su estado a "en curso"
  const handleIniciarPartido = async (partido) => {
    try {
      const updatedPartido = { ...partido, estado: 'en curso' };
      const res = await axios.put(`http://localhost:5000/api/partidos/${partido.id}`, updatedPartido);
      
      // Actualizar el estado local con el partido actualizado
      const partidosActualizados = partidos.map((p) =>
        p.id === res.data.id ? res.data : p
      );
      setPartidos(partidosActualizados);
    } catch (error) {
      console.error('Error al iniciar el partido:', error);
    }
  };

  // Función para actualizar un partido
  const handleEditPartido = async (partidoActualizado) => {
    try {
      const { id, ...data } = partidoActualizado;
      const res = await axios.put(`http://localhost:5000/api/partidos/${id}`, data);

      // Actualizar el estado local con los datos editados
      const partidosActualizados = partidos.map((p) =>
        p.id === res.data.id ? res.data : p
      );
      setPartidos(partidosActualizados);
      setModalEditarOpen(false);
    } catch (error) {
      console.error('Error al actualizar el partido:', error);
    }
  };

  const handleEliminarPartido = async (partidoId) => {
    try {
      // Solicitar al backend que elimine el partido
      await axios.delete(`http://localhost:5000/api/partidos/${partidoId}`);
  
      // Actualizar el estado local eliminando el partido
      setPartidos((prevPartidos) => prevPartidos.filter((partido) => partido.id !== partidoId));
    } catch (error) {
      console.error('Error al eliminar el partido:', error);
    }
  };
  

  //-------
  const handleCreatePartido = (nuevoPartido) => {
    // Añadir el nuevo partido a la lista de partidos
    setPartidos((prevPartidos) => [...prevPartidos, nuevoPartido]);
  };

  //editar partido
  // Abrir el formulario de edición
  const handleOpenEdit = (partido) => {
    setEditPartido(partido);
    setOpen(true);
  };

  // Cerrar el formulario de edición
  const handleCloseEdit = () => {
    setOpen(false);
    setEditPartido(null);
  };


  // Manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPartido((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar los datos modificados
  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/partidos/${editPartido.id}`, editPartido);
      setPartidos((prev) =>
        prev.map((partido) => (partido.id === editPartido.id ? editPartido : partido))
      );
      handleCloseEdit();
    } catch (error) {
      console.error('Error al actualizar el partido:', error);
    }
  };


  


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Barra de navegación horizontal con diseño deportivo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#1A237E', // Color base deportivo
          padding: '10px 20px',
          borderBottom: '2px solid #FFC107', // Detalles en dorado
        }}
      >
        {/* Título con tipografía deportiva */}
        <Typography
          variant="h6"
          sx={{
            color: '#FFC107', // Color dorado
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold',
            marginRight: '20px',
          }}
        >
          User Dashboard
        </Typography>
        
        {/* Menú de navegación horizontal */}
        <List sx={{ display: 'flex', margin: 0, padding: 0 }}>
          <ListItem
            button
            onClick={() => handleSectionChange('Disciplinas')}
            sx={{
              padding: '0 20px',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#FF4081', // Color al pasar el mouse
                borderRadius: '10px',
              },
            }}
          >
            <IconButton sx={{ color: '#FFC107', marginRight: '10px' }}>
              <BarChart />
            </IconButton>
            <ListItemText primary="Estadísticas" sx={{ color: '#fff' }} />
          </ListItem>
          <Divider orientation="vertical" flexItem sx={{ margin: '0 10px', borderColor: '#FFC107' }} />
          <ListItem
            button
            onClick={() => handleSectionChange('Torneos')}
            sx={{
              padding: '0 20px',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#FF4081',
                borderRadius: '10px',
              },
            }}
          >
            <IconButton sx={{ color: '#FFC107', marginRight: '10px' }}>
              <SportsSoccer />
            </IconButton>
            <ListItemText primary="Disciplinas" sx={{ color: '#fff' }} />
          </ListItem>
          <Divider orientation="vertical" flexItem sx={{ margin: '0 10px', borderColor: '#FFC107' }} />
          <ListItem
            button
            onClick={() => handleSectionChange('Equipos')}
            sx={{
              padding: '0 20px',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#FF4081',
                borderRadius: '10px',
              },
            }}
          >
            <IconButton sx={{ color: '#FFC107', marginRight: '10px' }}>
              <Group />
            </IconButton>
            <ListItemText primary="Equipos" sx={{ color: '#fff' }} />
          </ListItem>
          <Divider orientation="vertical" flexItem sx={{ margin: '0 10px', borderColor: '#FFC107' }} />
          <ListItem
            button
            onClick={() => handleSectionChange('Partidos')}
            sx={{
              padding: '0 20px',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#FF4081',
                borderRadius: '10px',
              },
            }}
          >
            <IconButton sx={{ color: '#FFC107', marginRight: '10px' }}>
              <EmojiEvents />
            </IconButton>
            <ListItemText primary="Partidos" sx={{ color: '#fff' }} />
          </ListItem>
        </List>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
  {activeSection === 'Disiciplinas' && (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Disiciplinas y Tabla de Posiciones
      </Typography>

      {/* Mostrar la lista de torneos */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#555' }}>Selecciona un torneo:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {torneos.map((torneo) => (
            <Button
              key={torneo.id}
              variant="contained"
              color="secondary"
              sx={{
                margin: '5px',
                borderRadius: 2,
                padding: '8px 20px',
                boxShadow: 2,
                '&:hover': { backgroundColor: '#ba68c8', boxShadow: 4 },
              }}
              onClick={() => handleTorneoSelect(torneo)}
            >
              {torneo.nombre}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Mostrar Tabla de Posiciones si showPosiciones es true */}
      {selectedTorneo && (
        <Box sx={{ marginTop: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={togglePosiciones}
            sx={{
              marginBottom: '15px',
              padding: '10px 20px',
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': { backgroundColor: '#1976d2', boxShadow: 4 },
            }}
          >
            {showPosiciones ? 'Ocultar Tabla de Posiciones' : 'Ver Tabla de Posiciones'}
          </Button>

          {showPosiciones && <TablaPosiciones posiciones={posiciones} />}
        </Box>
                    )}
                  </Box>
                )}

                {activeSection === 'Torneos' && (
                  <Box sx={{ padding: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
                    Lista de de Disiciplinas
                  </Typography>
            
                  <Grid container spacing={3}>
                    {torneos.map((torneo) => (
                      <Grid item xs={12} md={4} key={torneo.id}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                              {torneo.nombre}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                              <strong>Tipo:</strong> {torneo.tipo}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                              <strong>Fecha de Inicio:</strong> {new Date(torneo.fecha_inicio).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                              <strong>Fecha de Fin:</strong> {new Date(torneo.fecha_fin).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                              <strong>Lugar:</strong> {torneo.lugar}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                              <strong>Estado:</strong> {torneo.estado}
                            </Typography>
            
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{
                                marginTop: 2,
                                width: '100%',
                                borderRadius: 2,
                                '&:hover': { backgroundColor: '#1565c0' }
                              }}
                              onClick={() => handleOpenDetailsModal(torneo.id)}
                            >
                              Ver Detalles
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                  )}
                   {activeSection === 'Equipos' && (
          <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: 4,
            padding: 2,
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center" 
            sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 2 }}
          >
            Gestión de Equipos
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAbrirFormularioEquipo}
            sx={{ 
              marginBottom: 3, 
              paddingX: 3, 
              paddingY: 1.5, 
              borderRadius: 2, 
              boxShadow: 3, 
              '&:hover': { 
                backgroundColor: '#1565c0', 
              }
            }}
          >
            Agregar Nuevo Equipo
          </Button>
          
          <EquipoTable 
        equipos={equiposFiltrados}
        onAgregarJugador={handleAbrirFormulario} 
              onVerJugadores={handleVerJugadores}
        
      />
        </Box>
        )}

{activeSection === 'Partidos' && (
          <Box sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
            Gestión de Partidos
          </Typography>
    
          {/* Partidos Programados */}
          <Paper sx={{ marginBottom: 3, padding: 2, backgroundColor: '#f4f6f8', boxShadow: 3, borderRadius: '8px' }}>
            
            <TablaPartidos
              titulo="Partidos Programados"
              partidos={partidosProgramados}
              equipos={equipos}
              onIniciarPartido={handleIniciarPartido}
              onFinalizarPartido={handleFinalizarPartido}
              onEditarPartido={handleOpenEdit}
              onEliminarPartido={handleEliminarPartido}
            />
          </Paper>
    
          {/* Partidos En Curso */}
          <Paper sx={{ marginBottom: 3, padding: 2, backgroundColor: '#e8f5e9', boxShadow: 3, borderRadius: '8px' }}>
            
            <TablaPartidos
              titulo="Partidos En Curso"
              partidos={partidosEnCurso}
              equipos={equipos}
              onIniciarPartido={handleIniciarPartido}
              onFinalizarPartido={handleFinalizarPartido}
              onEditarPartido={handleOpenEdit}
              onEliminarPartido={handleEliminarPartido}
            />
          </Paper>
    
          {/* Partidos Finalizados */}
          <Paper sx={{ marginBottom: 3, padding: 2, backgroundColor: '#ffebee', boxShadow: 3, borderRadius: '8px' }}>

            <TablaPartidos
              titulo="Partidos Finalizados"
              partidos={partidosFinalizados}
              equipos={equipos}
              onIniciarPartido={handleIniciarPartido}
              onFinalizarPartido={handleFinalizarPartido}
              onEditarPartido={handleOpenEdit}
              onEliminarPartido={handleEliminarPartido}
            />
          </Paper>

      {/* Formulario de Edición */}
      <EditarPartido
        open={open}
        partido={editPartido}
        equipos={equipos}
        onClose={handleCloseEdit}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />

      {/* Modal para finalizar partido */}
      {partidoActual && (
        <FinalizarPartido
          open={modalFinalizarOpen}
          onClose={() => setModalFinalizarOpen(false)}
          partido={partidoActual}
          onUpdate={handleEditPartido}
        />
      )}
        </Box>
        )}
              </Box>



      {/* Diálogo para agregar jugador */}
      <AgregarJugadorDialog
        open={openDialog}
        onClose={handleCerrarFormulario}
        equipoSeleccionado={equipoSeleccionado}
        jugadorNombre={jugadorNombre}
        jugadorEdad={jugadorEdad}
        jugadorPosicion={jugadorPosicion}
        jugadorNumeroCamiseta={jugadorNumeroCamiseta}
        setJugadorNombre={setJugadorNombre}
        setJugadorEdad={setJugadorEdad}
        setJugadorPosicion={setJugadorPosicion}
        setJugadorNumeroCamiseta={setJugadorNumeroCamiseta}
        onAgregarJugador={handleAgregarJugador}jugadores={jugadores}
  
      
      />
      

      {/* Diálogo para ver jugadores */}
      <JugadoresDialog 
        jugadores={jugadores} 
        equipoSeleccionado={equipoSeleccionado} 
        onClose={() => setJugadores([])} 
        onEliminarJugador={handleEliminarJugador}
        onActualizarJugador={handleActualizarJugador}
      />
      {/* Modal de Agregar Equipo */}
      <AgregarEquipoDialog
        open={openDialogEquipo}
        onClose={handleCerrarFormularioEquipo}
        onAgregarEquipo={handleAgregarEquipo}
        nuevoEquipo={nuevoEquipo}
        setNuevoEquipo={setNuevoEquipo}
      />
              
                 

      {/* Modal de Crear Torneo */}
      {openCreateModal && (
        <CrearTorneoModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      )}

      {/* Modal de Editar Torneo */}
      {openEditModal && (
        <EditarTorneoModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          torneoId={selectedTorneoId}
          onUpdate={handleUpdateTorneo}
        />
      )}

      {/* Modal de Eliminar Torneo */}
      {openDeleteModal && (
        <EliminarTorneoModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          torneoToDelete={torneoToDelete} 
          onDelete={handleDeleteTorneo}
        />
      )}

      {/* Modal de Detalles del Torneo */}
      {openDetailsModal && (
        <DetallesTorneoModal
          open={openDetailsModal} 
          onClose={handleCloseDetailsModal}
          torneoId={torneoToView} />
      )}
    </Box>
  );
};

export default UserDashboard;
