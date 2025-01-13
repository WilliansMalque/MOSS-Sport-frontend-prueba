import React, { useState, useEffect } from "react";
import { Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from "@mui/material";

const CategoriasTorneosEquipos = () => {
  const [data, setData] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [filteredTorneos, setFilteredTorneos] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Log de los datos cuando se cargan desde el API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/categorias/categorias-torneos-equipos");
        const result = await response.json();
        console.log("Datos recibidos desde el servidor:", result); // Log de los datos recibidos
        setData(result);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar las categorías
  const categorias = [...new Set(data.map(item => item.categoria))];
  console.log("Categorías disponibles:", categorias); // Log de las categorías disponibles

  // Filtrar los torneos de la categoría seleccionada sin duplicados
  useEffect(() => {
    if (selectedCategoria) {
      console.log("Categoría seleccionada:", selectedCategoria); // Log de la categoría seleccionada
      const torneos = data
        .filter(item => item.categoria === selectedCategoria)
        .reduce((acc, item) => {
          if (!acc.some(torneo => torneo.torneo === item.torneo)) {
            acc.push(item);
          }
          return acc;
        }, []);
      console.log("Torneos filtrados para la categoría:", torneos); // Log de los torneos filtrados
      setFilteredTorneos(torneos);
      setSelectedTorneo(null); // Reseteamos el torneo cuando se cambia la categoría
      setFilteredEquipos([]);
    }
  }, [selectedCategoria, data]);

  // Filtrar los equipos del torneo seleccionado
  useEffect(() => {
    if (selectedTorneo) {
      console.log("Torneo seleccionado:", selectedTorneo); // Log del torneo seleccionado
      const equipos = data.filter(item => item.torneo === selectedTorneo && item.categoria === selectedCategoria);
      console.log("Equipos filtrados para el torneo:", equipos); // Log de los equipos filtrados
      setFilteredEquipos(equipos);
    }
  }, [selectedTorneo, selectedCategoria, data]);

  // Navegar hacia atrás
  const handleGoBackToCategorias = () => {
    setSelectedCategoria(null);
    setSelectedTorneo(null);
    setFilteredTorneos([]);
    setFilteredEquipos([]);
  };

  const handleGoBackToTorneos = () => {
    setSelectedTorneo(null);
    setFilteredEquipos([]);
  };

  return (
    <Grid container spacing={3} style={{ padding: '20px' }}>
      {/* Mostrar categorías */}
      {!selectedCategoria && !loading && (
        <>
          <Typography variant="h5" style={{ marginBottom: '20px' }}>
            Selecciona una categoría
          </Typography>
          {categorias.map((categoria, index) => (
            <Grid item xs={12} sm={6} md={4} key={`categoria-${categoria}-${index}`}>
              <Button 
                variant="contained" 
                onClick={() => setSelectedCategoria(categoria)} 
                fullWidth 
                style={{ padding: '20px', fontSize: '16px' }}
              >
                {categoria}
              </Button>
            </Grid>
          ))}
        </>
      )}

      {/* Mostrar torneos de la categoría seleccionada */}
      {selectedCategoria && !selectedTorneo && !loading && (
        <>
          <Typography variant="h5" style={{ marginBottom: '20px' }}>
            Torneos de la categoría: {selectedCategoria}
          </Typography>
          {filteredTorneos.map((torneo, index) => (
            <Grid item xs={12} sm={6} md={4} key={`torneo-${torneo.torneo_id}-${index}`}>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedTorneo(torneo.torneo)} 
                fullWidth 
                style={{ padding: '20px', fontSize: '16px' }}
              >
                {torneo.torneo}
              </Button>
            </Grid>
          ))}
        </>
      )}

      {/* Mostrar equipos del torneo seleccionado */}
      {selectedTorneo && filteredEquipos.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: '20px' }}>
            Equipos inscritos en {selectedTorneo} - {selectedCategoria}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Capitán</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEquipos.map((equipo, index) => (
                  <TableRow key={`equipo-${equipo.equipo_id}-${index}`}>
                    <TableCell>{equipo.equipo}</TableCell>
                    <TableCell>{equipo.capitan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {/* Cargando spinner mientras los datos se cargan */}
      {loading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}

      {/* Botones de navegación */}
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        {selectedCategoria && !selectedTorneo && (
          <Button 
            variant="contained" 
            onClick={handleGoBackToCategorias} 
            fullWidth 
            style={{ padding: '10px', fontSize: '16px' }}
          >
            Volver a Categorías
          </Button>
        )}
        {selectedTorneo && (
          <Button 
            variant="contained" 
            onClick={handleGoBackToTorneos} 
            fullWidth 
            style={{ padding: '10px', fontSize: '16px' }}
          >
            Volver a Torneos
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default CategoriasTorneosEquipos;
