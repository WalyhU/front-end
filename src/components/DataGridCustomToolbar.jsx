import React from "react";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";

function DataGridCustomToolbar() {
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%" marginBottom="0.5rem">
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </FlexBetween>
      </FlexBetween>
    </GridToolbarContainer>
  );
}

export default DataGridCustomToolbar;
