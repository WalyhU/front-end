import React, { useState } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useGetTareasQuery, useDeleteTareaQuery } from "state/api";
import { Box, useTheme, Button } from "@mui/material";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

function Home() {
  const theme = useTheme();
  const { data, isLoading, refetch } = useGetTareasQuery();
  const [selectedRows, setSelectedRows] = useState([]);
  const [checkboxSelection, setCheckboxSelection] = useState(false);
  const deleteTareaMutation = useDeleteTareaQuery();
  const apiRef = useGridApiRef();

  const handleDelete = async () => {
    const selectedRowIds = apiRef.current.getSelectedRows(); // Obtener los IDs de las filas seleccionadas
    const tareaIds = Object.keys(selectedRowIds); // Convertir los IDs en un array
    await Promise.all(tareaIds.map((tareaId) => deleteTareaMutation.mutateAsync(tareaId)));
    apiRef.current.selectRow([], false); // Desseleccionar las filas
    refetch();
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.4,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      renderCell: (params) => {
        return params.value.replace(/^Nombre del alumno:/, "");
      },
    },
    {
      field: "carnet",
      headerName: "Carnet",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^Carnet:/, "");
      },
    },
    {
      field: "resumen",
      headerName: "Resumen",
      flex: 2,
      renderCell: (params) => {
        return params.value.replace(/^Resumen:/, "");
      },
    },
    {
      field: "nota",
      headerName: "Nota",
      flex: 0.2,
      renderCell: (params) => {
        // dejar solo numeros en el parametro
        return params.value.match(/\w\d\%/g);
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
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
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
          checkboxSelection={checkboxSelection}
          onSelectionModelChange={(newSelection) => {
            if (newSelection.length >= 1) {
              setCheckboxSelection(true);
            } else {
              setCheckboxSelection(false);
            }
          }}
          loading={isLoading || !data}
          getRowId={(row) => row.id}
          rows={data || []}
          columns={columns}
          components={{ Toolbar: DataGridCustomToolbar }}
          onRowClick={setSelectedRows}
          apiRef={apiRef}
        />
      </Box>
      <Box mt={2}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
        >
          Eliminar
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
