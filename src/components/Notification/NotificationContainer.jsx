import { Snackbar, Alert, Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import useNotificationStore from "../../store/notificationStore";

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxWidth: 400,
      }}>
      {notifications.map((notification) => (
        <Snackbar key={notification.id} open={true} autoHideDuration={null}>
          <Alert
            severity={notification.type}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => removeNotification(notification.id)}>
                <Close fontSize="small" />
              </IconButton>
            }
            sx={{ width: "100%" }}>
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}
