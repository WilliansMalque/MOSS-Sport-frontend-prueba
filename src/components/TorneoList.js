// components/TorneoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TorneoList = () => {
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    // Obtener los torneos
    axios.get('http://localhost:5000/api/torneos')
      .then(response => {
        setTorneos(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedTorneo) {
      // Obtener categorías de un torneo
      axios.get(`http://localhost:5000/api/torneos/${selectedTorneo}/categorias`)
        .then(response => {
          setCategorias(response.data);
        })
        .catch(error => console.error(error));
    }
  }, [selectedTorneo]);

  useEffect(() => {
    if (selectedCategoria) {
      // Obtener posiciones de una categoría
      axios.get(`http://localhost:5000/api/categorias/${selectedCategoria}/posiciones`)
        .then(response => {
          setPosiciones(response.data);
        })
        .catch(error => console.error(error));
    }
  }, [selectedCategoria]);

  return (
    <div>
      <h2>Torneos</h2>
      <ul>
        {torneos.map(torneo => (
          <li key={torneo.id} onClick={() => setSelectedTorneo(torneo.id)}>
            {torneo.nombre}
          </li>
        ))}
      </ul>

      {selectedTorneo && (
        <div>
          <h3>Categorías de Torneo</h3>
          <ul>
            {categorias.map(categoria => (
              <li key={categoria.id} onClick={() => setSelectedCategoria(categoria.id)}>
                {categoria.nombre}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCategoria && (
        <div>
          <h3>Tabla de Posiciones</h3>
          <table>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {posiciones.map(posicion => (
                <tr key={posicion.id}>
                  <td>{posicion.nombre}</td>
                  <td>{posicion.puntos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TorneoList;
