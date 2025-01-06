import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

const EditarPartido = ({
  open,
  partido,
  equipos,
  onClose,
  onSubmit,
  onChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Partido</DialogTitle>
      <DialogContent>
        <TextField
          label="Fecha y Hora"
          type="datetime-local"
          fullWidth
          name="fecha_hora"
          value={partido?.fecha_hora || ''}
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Lugar"
          fullWidth
          name="lugar"
          value={partido?.lugar || ''}
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            name="estado"
            value={partido?.estado || ''}
            onChange={onChange}
          >
            <MenuItem value="programado">Programado</MenuItem>
            <MenuItem value="en curso">En Curso</MenuItem>
            <MenuItem value="finalizado">Finalizado</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Goles Local"
          type="number"
          fullWidth
          name="goles_local"
          value={partido?.goles_local || ''}
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Goles Visitante"
          type="number"
          fullWidth
          name="goles_visitante"
          value={partido?.goles_visitante || ''}
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Arbitro"
          fullWidth
          name="arbitro"
          value={partido?.arbitro || ''}
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Equipo Local</InputLabel>
          <Select
            label="Equipo Local"
            name="equipo_local_id"
            value={partido?.equipo_local_id || ''}
            onChange={onChange}
          >
            {equipos.map((equipo) => (
              <MenuItem key={equipo.equipo_id} value={equipo.equipo_id}>
                {equipo.nombre_equipo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Equipo Visitante</InputLabel>
          <Select
            label="Equipo Visitante"
            name="equipo_visitante_id"
            value={partido?.equipo_visitante_id || ''}
            onChange={onChange}
          >
            {equipos.map((equipo) => (
              <MenuItem key={equipo.equipo_id} value={equipo.equipo_id}>
                {equipo.nombre_equipo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarPartido;
