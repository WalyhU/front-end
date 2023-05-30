import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useGetTareasQuery } from "state/api";

const ShowCard = ({
  id,
  nombre,
  carnet,
  resumen,
  calificacion,
  tema,
  categoria,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.primary[100]}
          gutterBottom
        >
          {carnet.replace(/^Carnet:/, "")}
        </Typography>
        <Typography variant="h5" component="div">
          {nombre.replace(/^Nombre del alumno:/, "")}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[200]}>
          Nota: {Number(parseInt(calificacion.match(/\w\d/g))).toFixed(2)}%
        </Typography>
        <Rating value={parseFloat(parseInt(calificacion.match(/\w\d/g)) * 0.05).toFixed(2)} readOnly />

        <Typography variant="body2">{resumen.replace(/^Resumen:/, "")}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="primary"
          onClick={() => setExpanded(!expanded)}
        >
          Ver más
        </Button>
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
            <Typography paragraph>id: {id}</Typography>
            <Typography paragraph>Tema: {tema}</Typography>
            <Typography paragraph>Categoria: {categoria}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

function Cards() {
  const { data, isLoading } = useGetTareasQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  console.log("🚀 ~ file: index.jsx:19 ~ Products ~ data:", data);
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TAREAS" subtitle="Se muestran todas las tareas con sus calificaciones" />
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": {
              gridColumn: isNonMobile ? undefined : "span 4",
            },
          }}
        >
          {data.map(
            ({
                id,
                nombre,
                carnet,
                resumen,
                calificacion,
                tema,
                categoria,
            }) => (
              <ShowCard
                key={id}
                id={id}
                nombre={nombre}
                carnet={carnet}
                resumen={resumen}
                calificacion={calificacion}
                tema={tema}
                categoria={categoria}
              />
            )
          )}
        </Box>
      ) : (
        <Box>Cargando...</Box>
      )}
    </Box>
  );
}

export default Cards;
