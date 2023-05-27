import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "./scenes/home";
import Layout from "./scenes/layout";
import Cards from "./scenes/cards"

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/tarjetas" element={<Cards />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
