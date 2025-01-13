import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper } from '@mui/material';
import axios from 'axios';
import CrearTorneoModal from '../components/CrearTorneoModal';
import EditarTorneoModal from '../components/EditarTorneoModal';
import EliminarTorneoModal from '../components/EliminarTorneoModal'; // Importamos el modal de eliminación
import DetallesTorneoModal from '../components/DetallesTorneoModal'; // Importamos el modal de detalles
import TablaPosiciones from '../components/TablaPosiciones'; // Importamos el componente TablaPosiciones

import { createTheme, ThemeProvider } from '@mui/material/styles';
import EquipoTable from '../components/EquipoTable'; 
import AgregarJugadorDialog from '../components/AgregarJugadorDialog';
import JugadoresDialog from '../components/JugadoresDialog';
import AgregarEquipoDialog from '../components/AgregarEquipoDialog'; // Importar el componente para agregar equipo


//-----
import FinalizarPartido from '../components/FinalizarPartido'; // Importar el nuevo componente
import CrearPartido from '../components/CrearPartido'; // Importar el nuevo componente
import TablaPartidos from '../components/TablaPartidos'; // Importa el componente TablaPartidos
import EditarPartido from '../components/EditarPartido';

import RegisterPage from './RegisterPage';
import SeleccionarTorneosYCategorias from '../pages/SeleccionarTorneosYCategorias';


const AdminDashboard = () => {
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
    console.log('ID del equipo seleccionado al abrir el formulario:', equipo.equipo_id);  // Accede a 'equipo_id' en vez de 'id'
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
    // Verificamos si los campos están completos
    if (!jugadorNombre || !jugadorEdad || !jugadorPosicion || !jugadorNumeroCamiseta) {
      alert('Por favor complete todos los campos.');
      return;
    }
  
    console.log('Equipo seleccionado:', equipoSeleccionado);  // Verifica el equipo seleccionado
  
    // Verificar si el equipo seleccionado tiene un id válido
    if (!equipoSeleccionado || !equipoSeleccionado.equipo_id) {
      alert('Por favor selecciona un equipo.');
      return;
    }
  
    try {
      // Crear el objeto newJugador
      const newJugador = {
        nombre: jugadorNombre,
        edad: jugadorEdad,
        posicion: jugadorPosicion,
        numero_camiseta: jugadorNumeroCamiseta,
        equipo_id: equipoSeleccionado.equipo_id,  // Asegúrate de que equipo_id esté definido
      };
  
      // Log para verificar los datos del jugador antes de enviarlos
      console.log('Datos del nuevo jugador:', newJugador);
  
      // Realizar la solicitud POST al backend
      const response = await axios.post('http://localhost:5000/api/jugadores', newJugador);
      console.log('Respuesta del backend al agregar jugador:', response.data);
  
      // Cerrar el formulario después de agregar al jugador
      handleCerrarFormulario();
  
      // Obtener la lista actualizada de equipos
      const equiposResponse = await axios.get('http://localhost:5000/api/equipos/detalles');
      setEquipos(equiposResponse.data);
  
    } catch (error) {
      console.error('Error al agregar jugador:', error);
    }
  };
  
  
  

  const handleVerJugadores = async (equipoId) => {
    console.log('ID del equipo seleccionado al intentar ver jugadores:', equipoId);  // Verifica que el equipoId se pase correctamente
    try {
      const response = await axios.get('http://localhost:5000/api/jugadores');
      console.log('Respuesta de jugadores:', response.data);
      const jugadoresEquipo = response.data.filter(jugador => jugador.equipo_id === equipoId);
      console.log('Jugadores filtrados:', jugadoresEquipo);
      
      if (jugadoresEquipo.length === 0) {
        console.log('No se encontraron jugadores para este equipo');
      }
  
      setJugadores(jugadoresEquipo);  // Actualiza el estado con los jugadores
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

  
  // Función para eliminar un equipo
  const eliminarEquipo = async (equipoId) => {
    try {
      console.log(`Eliminando equipo con ID: ${equipoId}`); // Log para ver el ID
      const response = await axios.delete(`http://localhost:5000/api/equipos/${equipoId}`);
      
      console.log('Respuesta de la eliminación:', response); // Ver respuesta completa
      
      if (response.status === 200) {
        setEquipos(equipos.filter((equipo) => equipo.id !== equipoId)); // Eliminar el equipo de la lista
        setMensaje('Equipo eliminado con éxito');
        setEquipoSeleccionado(equipos.find(equipo => equipo.equipo_id === equipoId));  // Seteamos el equipo seleccionado
       // Resetear el equipo seleccionado
      } else {
        setMensaje('Error al eliminar el equipo');
      }
    } catch (error) {
      setMensaje('Error al eliminar el equipo');
      console.error('Error al eliminar el equipo:', error);
    }
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
      const equiposResponse = await axios.get('http://localhost:5000/api/equipos');
      setEquipos(equiposResponse.data);
    } catch (error) {
      if (error.response) {
        // Si el servidor respondió con un error (código 4xx o 5xx)
        console.error('Error al agregar equipo:', error.response.data);
      } else {
        // Si ocurrió un error al enviar la solicitud
        console.error('Error al enviar solicitud:', error.message);
      }
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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Menú lateral */}
      <Box sx={{ width: '250px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd', padding: '20px' }}>
        <Typography variant="h6" gutterBottom>Admin Dashboard</Typography>
        <List>
          <ListItem button onClick={() => handleSectionChange('Estadísticas')}>
            <ListItemText primary="Estadísticas" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleSectionChange('Disciplinas')}>
            <ListItemText primary="Disciplinas" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleSectionChange('Equipos')}>
            <ListItemText primary="Equipos" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleSectionChange('Partidos')}>
            <ListItemText primary="Partidos" />
          </ListItem>
          <Divider />
      {/* Botón adicional para registrar usuarios */}
      <ListItem button onClick={() => handleSectionChange('RegistrarUsuarios')}>
        <ListItemText primary="Registrar Usuarios" />
      </ListItem>
      <Divider />
      {/* Botón adicional para registrar usuarios */}
      <ListItem button onClick={() => handleSectionChange('CategoriasTorneos')}>
        <ListItemText primary="Categorias y Disciplinas" />
      </ListItem>
        </List>
        
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, padding: '20px' }}>
        {activeSection === 'Estadísticas' && (
          <Box>
            <Typography variant="h4" gutterBottom>Tabla de Posiciones</Typography>

        {/* Mostrar la lista de torneos */}
        <Box sx={{ marginBottom: '20px' }}>
          <Typography variant="h6">Selecciona una Disciplina:</Typography>
          {torneos.map((torneo) => (
            <Button
              key={torneo.id}
              variant="contained"
              color="secondary"
              sx={{ margin: '5px' }}
              onClick={() => handleTorneoSelect(torneo)}
            >
              {torneo.nombre}
            </Button>
          ))}
        </Box>

        {/* Mostrar Tabla de Posiciones si showPosiciones es true */}
        {selectedTorneo && (
          <Box sx={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={togglePosiciones}>
              {showPosiciones ? 'Ocultar Tabla de Posiciones' : 'Ver Tabla de Posiciones'}
            </Button>

            {showPosiciones && <TablaPosiciones posiciones={posiciones} />}
          </Box>
                    )}
                  </Box>
                )}

                {activeSection === 'Disciplinas' && (
                  <Box>
                    <Typography variant="h4" gutterBottom>Gestión de Disciplinas</Typography>
                    <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                      Crear Nueva Disciplina
                    </Button>
                    <Grid container spacing={3}>
                      {torneos.map((torneo) => (
                        <Grid item xs={12} md={4} key={torneo.id}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6">{torneo.nombre}</Typography>
                              <Typography variant="body2"><strong>Tipo:</strong> {torneo.tipo}</Typography>
                              <Typography variant="body2"><strong>Fecha de Inicio:</strong> {new Date(torneo.fecha_inicio).toLocaleDateString()}</Typography>
                              <Typography variant="body2"><strong>Fecha de Fin:</strong> {new Date(torneo.fecha_fin).toLocaleDateString()}</Typography>
                              <Typography variant="body2"><strong>Lugar:</strong> {torneo.lugar}</Typography>
                              <Typography variant="body2"><strong>Categorias:</strong> {torneo.categorias}</Typography>
                              <Typography variant="body2"><strong>Estado:</strong> {torneo.estado}</Typography>
                              
                              <Button
                                variant="outlined"
                                color="primary"
                                sx={{ marginTop: '10px', marginRight: '10px' }}
                                onClick={() => handleOpenEditModal(torneo.id)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="outlined" 
                                color="secondary" 
                                sx={{ marginTop: '10px', marginRight: '10px' }} 
                                onClick={() => handleOpenDeleteModal(torneo.id)}
                              >
                                Eliminar
                              </Button>
                              <Button
                                variant="contained"
                                color="info"
                                sx={{ marginTop: '10px' }}
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
          <Box>
            <Typography variant="h4" gutterBottom>Gestión de Equipos</Typography>
            <Button variant="contained" color="primary" onClick={handleAbrirFormularioEquipo}>Agregar Nuevo Equipo</Button>
            
            
            <EquipoTable 
              equipos={equipos} 
              onAgregarJugador={handleAbrirFormulario} 
              onVerJugadores={handleVerJugadores}
              onEliminarEquipo={eliminarEquipo}

            />
            
          </Box>
        )}

{activeSection === 'Partidos' && (
          <Box sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Partidos
          </Typography>
          {/* Botón para abrir el modal */}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setModalOpen(true)} 
            sx={{ marginBottom: 3 }}
          >
            Agregar Partido
          </Button>
    
          {/* Modal de creación de partido */}
          <CrearPartido 
            open={modalOpen} 
            onClose={() => setModalOpen(false)} 
            onCreate={handleCreatePartido} 
          />
          
    
          <TablaPartidos
        titulo="Partidos Programados"
        partidos={partidosProgramados}
        equipos={equipos}
        onIniciarPartido={handleIniciarPartido}
        onFinalizarPartido={handleFinalizarPartido}
        onEditarPartido={handleOpenEdit}
        onEliminarPartido={handleEliminarPartido}
      />

      <TablaPartidos
        titulo="Partidos En Curso"
        partidos={partidosEnCurso}
        equipos={equipos}
        onIniciarPartido={handleIniciarPartido}
        onFinalizarPartido={handleFinalizarPartido}
        onEditarPartido={handleOpenEdit}
        onEliminarPartido={handleEliminarPartido}
      />

      <TablaPartidos
        titulo="Partidos Finalizados"
        partidos={partidosFinalizados}
        equipos={equipos}
        onIniciarPartido={handleIniciarPartido}
        onFinalizarPartido={handleFinalizarPartido}
        onEditarPartido={handleOpenEdit}
        onEliminarPartido={handleEliminarPartido}
      />

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
        {activeSection === 'RegistrarUsuarios' && <RegisterPage />}
        {activeSection === 'CategoriasTorneos' && <SeleccionarTorneosYCategorias />}
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

export default AdminDashboard;
