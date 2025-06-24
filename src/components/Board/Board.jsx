import { Box } from "@mui/material";
import { Column } from "../Column/Column";
import { DnDProvider } from "../DnD/DnDProvider";
import { COLUMN_ORDER, COLUMN_TITLES } from "../../utils/constants";

export function Board() {
  return (
    <DnDProvider>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          minHeight: "70vh",
          pb: 2,
          px: 1,
        }}>
        {COLUMN_ORDER.map((columnKey) => (
          <Column
            key={columnKey}
            columnKey={columnKey}
            title={COLUMN_TITLES[columnKey]}
          />
        ))}
      </Box>
    </DnDProvider>
  );
}
