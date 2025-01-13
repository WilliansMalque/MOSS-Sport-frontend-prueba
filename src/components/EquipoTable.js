import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';

const EquipoTable = ({ onAgregarJugador, onVerJugadores, onEliminarEquipo }) => {
  const [equipos, setEquipos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [equipoAEliminar, setEquipoAEliminar] = useState(null);
  const [filtro, setFiltro] = useState(''); // Estado para el filtro de búsqueda
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(''); // Estado para el filtro de categoría
  const [categorias, setCategorias] = useState([]); // Estado para las categorías únicas

  // Realizar la petición para obtener los datos de equipos, torneos y categorías
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/equipos/categorias');
        const data = await response.json();
        console.log('Datos obtenidos de la API:', data); // Verifica la estructura de los datos

        // Verificar si la respuesta es un arreglo
        if (Array.isArray(data)) {
          setEquipos(data); // Guardamos los datos en el estado si es un arreglo
          // Obtener las categorías únicas
          const categoriasUnicas = Array.from(new Set(data.map(equipo => equipo.categoria_nombre)));
          setCategorias(categoriasUnicas);
          console.log('Categorías únicas:', categoriasUnicas);
        } else {
          console.error('La respuesta de la API no es un arreglo válido');
        }
      } catch (error) {
        console.error('Error al obtener los equipos:', error);
      }
    };

    fetchEquipos();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función para abrir el diálogo de confirmación
  const handleOpenDialog = (equipoId) => {
    setEquipoAEliminar(equipoId);
    setOpenDialog(true);
  };

  // Función para cerrar el diálogo sin hacer nada
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEquipoAEliminar(null);
  };

  // Función para confirmar la eliminación
  const handleConfirmarEliminacion = () => {
    if (equipoAEliminar !== null) {
      onEliminarEquipo(equipoAEliminar);  // Llama a la función de eliminación
    }
    handleCloseDialog();
  };

  // Filtrar los equipos según el texto de búsqueda y la categoría seleccionada
  const equiposFiltrados = equipos.filter((equipo) => {
    const textoFiltro = filtro.toLowerCase();
    const categoriaFiltro = categoriaSeleccionada ? equipo.categoria_nombre.toLowerCase() === categoriaSeleccionada.toLowerCase() : true;
    return (
      (equipo.equipo_nombre.toLowerCase().includes(textoFiltro) ||
      equipo.torneo_nombre.toLowerCase().includes(textoFiltro) ||
      equipo.categoria_nombre.toLowerCase().includes(textoFiltro)) &&
      categoriaFiltro
    );
  });

  console.log('Equipos filtrados:', equiposFiltrados); // Log de equipos filtrados

  return (
    <div>
      {/* Filtro de búsqueda */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Buscar por equipo, torneo o categoría"
          variant="outlined"
          fullWidth
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)} // Actualiza el filtro
        />
      </Box>

      {/* Botones para filtrar por categoría */}
      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant={categoriaSeleccionada === '' ? 'contained' : 'outlined'}
          onClick={() => {
            setCategoriaSeleccionada('');
            console.log('Se seleccionó "Todos"'); // Log al seleccionar "Todos"
          }}
          sx={{ marginRight: 1 }}
        >
          Todos
        </Button>
        {categorias.map((categoria) => (
          <Button
            key={categoria}
            variant={categoriaSeleccionada === categoria ? 'contained' : 'outlined'}
            onClick={() => {
              setCategoriaSeleccionada(categoria);
              console.log('Se seleccionó categoría:', categoria); // Log al seleccionar categoría
            }}
            sx={{ marginRight: 1 }}
          >
            {categoria}
          </Button>
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: '80%' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center"><strong>Nombre del Equipo</strong></TableCell>
              <TableCell align="center"><strong>Nombre del Capitán</strong></TableCell>
              <TableCell align="center"><strong>Nombre del Torneo</strong></TableCell>
              <TableCell align="center"><strong>Categoria</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equiposFiltrados.map((equipo) => (
              <TableRow key={equipo.id}>
                <TableCell align="center">{equipo.equipo_nombre}</TableCell>
                <TableCell align="center">{equipo.creador_equipo || 'No asignado'}</TableCell>
                <TableCell align="center">{equipo.torneo_nombre}</TableCell>
                <TableCell align="center">{equipo.categoria_nombre}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" color="primary" onClick={() => onAgregarJugador(equipo)} sx={{ marginRight: 1 }}>
                    Agregar Jugador
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => onVerJugadores(equipo.equipo_id)} sx={{ marginRight: 1 }}>
  Ver Jugadores
</Button>

                  <Button variant="outlined" color="error" onClick={() => handleOpenDialog(equipo.equipo_id)}>
                    Eliminar Equipo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que quieres eliminar este equipo? Esta acción no se puede deshacer.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmarEliminacion} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EquipoTable;
