import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [jugadores, setJugadores] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  // Función para obtener los jugadores del equipo seleccionado
  const handleVerJugadores = async (equipoId) => {
    console.log('ID del equipo seleccionado al intentar ver jugadores:', equipoId);  // Verifica que equipoId esté llegando bien
    
    try {
      // Realizar la solicitud al backend para obtener todos los jugadores
      const response = await axios.get('http://localhost:5000/api/jugadores');
      console.log('Respuesta de jugadores:', response.data);
      
      // Filtrar los jugadores por equipo_id
      const jugadoresEquipo = response.data.filter(jugador => jugador.equipo_id === equipoId);
      console.log('Jugadores filtrados:', jugadoresEquipo);
      
      // Si no hay jugadores, mostrar mensaje en la consola
      if (jugadoresEquipo.length === 0) {
        console.log('No se encontraron jugadores para este equipo');
      }
  
      // Actualizar el estado con los jugadores filtrados
      setJugadores(jugadoresEquipo);
    } catch (error) {
      console.error('Error al obtener los jugadores:', error);
    }
  };

  // Función para seleccionar el equipo y abrir el formulario
  const handleAbrirFormulario = (equipo) => {
    console.log('Equipo seleccionado al abrir el formulario:', equipo);  // Log para ver qué equipo se selecciona
    setEquipoSeleccionado(equipo);  // Establecer el equipo seleccionado
  };

  // Función para obtener los equipos (esto puede venir de un useEffect o ser cargado desde una API)
  const obtenerEquipos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/equipos/categorias');
      console.log('Equipos obtenidos:', response.data);
      // Asegúrate de manejar la respuesta para setear los equipos correctamente
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  };

  useEffect(() => {
    obtenerEquipos();  // Obtener equipos al cargar el componente
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Renderiza los equipos y permite seleccionar uno */}
      <button onClick={() => handleAbrirFormulario({ equipo_id: 154, equipo_nombre: 'equipo5' })}>
        Ver Jugadores de equipo5
      </button>

      {/* Ver los jugadores del equipo seleccionado */}
      <button onClick={() => equipoSeleccionado && handleVerJugadores(equipoSeleccionado.equipo_id)}>
        Ver Jugadores
      </button>

      {/* Mostrar la lista de jugadores */}
      <div>
        {jugadores.length === 0 ? (
          <p>No se encontraron jugadores para este equipo.</p>
        ) : (
          <ul>
            {jugadores.map((jugador) => (
              <li key={jugador.id}>
                {jugador.nombre} - {jugador.posicion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
