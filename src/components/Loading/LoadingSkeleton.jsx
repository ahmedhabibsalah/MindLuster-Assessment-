import { Box, Skeleton, Card, CardContent } from "@mui/material";

export function TaskCardSkeleton() {
  return (
    <Card>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
          <Skeleton variant="text" width="80%" height={32} />
        </Box>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={16} />
      </CardContent>
    </Card>
  );
}

export function ColumnSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </Box>
  );
}

export function BoardSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        overflowX: "auto",
        minHeight: "70vh",
        pb: 2,
        px: 1,
      }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            flex: "1 1 300px",
            minWidth: 300,
            maxWidth: 350,
            bgcolor: "grey.50",
            p: 2,
            borderRadius: 2,
          }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          <ColumnSkeleton />
        </Box>
      ))}
    </Box>
  );
}
