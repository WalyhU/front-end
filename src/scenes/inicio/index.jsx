import React, { useState } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import {
  useGetTareasQuery,
  useDeleteTareaMutation,
  useAddTareaMutation,
} from "state/api";
import {
  Box,
  useTheme,
  Button,
  Modal,
  Typography,
  Grid,
  TextField,
  Alert,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { Add } from "@mui/icons-material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AgregarModal = ({ style, handleClose, open, refetch }) => {
  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Agregar Tarea
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <AgregarTarea refetch={refetch} />
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

const AgregarTarea = ({ refetch }) => {
  const [pathCarpeta, setPathCarpeta] = useState("");
  const [tema, setTema] = useState("");
  const [categoria, setCategoria] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [message, setMessage] = useState("Agregar");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setMessage("Agregar");
  };

  const [addTarea] = useAddTareaMutation();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await addTarea({
        pathCarpeta,
        tema,
        categoria,
      });
      refetch();
      setMessage("Tarea(s) agregada(s) exitosamente!");
      setIsLoading(false);
      setPathCarpeta("");
      setTema("");
      setCategoria("");
    } catch (e) {
      setMessage("Error!");
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ruta de la carpeta"
            type="text"
            variant="outlined"
            value={pathCarpeta}
            onChange={(e) => setPathCarpeta(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Categoría (Clase o Curso)"
            variant="outlined"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tema"
            variant="outlined"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
          />
        </Grid>
      </Grid>
      <Box>
        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={isLoading || message !== "Agregar"}
          color={message === "Error!" ? "error" : "secondary"}
        >
          {isLoading ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          ) : (
            message
          )}
        </Button>
      </Box>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={message === "Error!" ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

function Home() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState(
    selectedRows.size !== 0 || !undefined
  );
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data, isLoading, refetch } = useGetTareasQuery();
  const [deleteTarea] = useDeleteTareaMutation();
  const apiRef = useGridApiRef();

  // Crear un SweetAlert para eliminar
  const MySwal = withReactContent(Swal);

  const handleDeleteAlert = () => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
        MySwal.fire("Eliminado!", "La tarea ha sido eliminada.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire("Cancelado", "La tarea no ha sido eliminada.", "error");
      }
    });
  };

  const handleSelectionChange = () => {
    setSelectedRows(apiRef.current.getSelectedRows);
    setDisabled(selectedRows.size === 0 || selectedRows.size === !undefined);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: theme.palette.background.alt,
    borderRadius: 2,
    p: 4,
  };

  const handleDelete = async () => {
    const Tareas = [];
    selectedRows.forEach((row) => {
      Tareas.push(row.id);
    });
    await deleteTarea(Tareas);
    refetch();
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.2,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^Nombre del alumno:/, "");
      },
    },
    {
      field: "carnet",
      headerName: "Carnet",
      flex: 0.2,
      renderCell: (params) => {
        return params.value.replace(/^Carnet:/, "");
      },
    },
    {
      field: "resumen",
      headerName: "Resumen",
      flex: 1,
      renderCell: (params) => {
        return params.value.replace(/^Resumen:/, "");
      },
    },
    {
      field: "calificacion",
      headerName: "Nota",
      flex: 0.1,
      renderCell: (params) => {
        // dejar solo numeros en el parametro
        return params.value.match(/\w\d%/g);
      },
    },
    {
      field: "tema",
      headerName: "Tema",
      flex: 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TAREAS" subtitle="Todas las tareas" />
      <Box mb={2} mt={2}>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          <Add /> Agregar Tareas
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAlert}
          disabled={disabled}
          sx={{
            marginLeft: "1rem",
          }}
        >
          Eliminar
        </Button>
        <AgregarModal
          style={style}
          handleClose={handleClose}
          open={open}
          refetch={refetch}
        />
      </Box>
      <Box
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            maxWidth: "90%",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.main,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          onStateChange={handleSelectionChange}
          loading={isLoading || !data}
          getRowId={(row) => row.id}
          rows={data || []}
          columns={columns}
          components={{ Toolbar: DataGridCustomToolbar }}
          apiRef={apiRef}
        />
      </Box>
    </Box>
  );
}

export default Home;
