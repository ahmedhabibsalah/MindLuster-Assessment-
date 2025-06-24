import { Box, useMediaQuery, useTheme, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Column } from "../Column/Column";
import { DnDProvider } from "../DnD/DnDProvider";
import { COLUMN_ORDER, COLUMN_TITLES } from "../../utils/constants";

export function Board() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isMobile) {
    return (
      <DnDProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
          role="main"
          aria-label="Kanban board">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="Kanban columns"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 2,
              "& .MuiTab-root": {
                minHeight: 48,
                fontSize: "0.875rem",
              },
            }}>
            {COLUMN_ORDER.map((columnKey, index) => (
              <Tab
                key={columnKey}
                label={COLUMN_TITLES[columnKey]}
                id={`column-tab-${index}`}
                aria-controls={`column-panel-${index}`}
              />
            ))}
          </Tabs>

          {COLUMN_ORDER.map((columnKey, index) => (
            <Box
              key={columnKey}
              role="tabpanel"
              hidden={activeTab !== index}
              id={`column-panel-${index}`}
              aria-labelledby={`column-tab-${index}`}
              sx={{
                flex: 1,
                overflow: "hidden",
                display: activeTab === index ? "block" : "none",
              }}>
              {activeTab === index && (
                <Column
                  columnKey={columnKey}
                  title={COLUMN_TITLES[columnKey]}
                  animationDelay={index}
                />
              )}
            </Box>
          ))}
        </Box>
      </DnDProvider>
    );
  }

  return (
    <DnDProvider>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 3 },
          overflowX: "auto",
          minHeight: "70vh",
          pb: 2,
          px: { xs: 0, sm: 1 },
        }}
        role="main"
        aria-label="Kanban board">
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
