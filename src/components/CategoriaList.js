import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PosicionesTable from './PosicionesTable';

const CategoriaList = ({ torneoId }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    // Obtener las categorías del torneo
    axios.get(`http://localhost:5000/api/torneos/${torneoId}/categorias`)
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error al cargar las categorías:', error);
      });
  }, [torneoId]);

  const handleCategoriaClick = (categoriaId) => {
    setSelectedCategoria(categoriaId); // Establece la categoría seleccionada
  };

  return (
    <div>
      <h3>Selecciona una Categoría</h3>
      <ul>
        {categorias.map(categoria => (
          <li key={categoria.id} onClick={() => handleCategoriaClick(categoria.id)}>
            {categoria.nombre}
          </li>
        ))}
      </ul>

      {selectedCategoria && <PosicionesTable categoriaId={selectedCategoria} />}
    </div>
  );
};

export default CategoriaList;
