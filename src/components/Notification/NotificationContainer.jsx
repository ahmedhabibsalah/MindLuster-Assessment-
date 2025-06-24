import {
  Snackbar,
  Alert,
  Box,
  IconButton,
  Slide,
  Grow,
  Portal,
} from "@mui/material";
import { Close, CheckCircle, Error, Warning, Info } from "@mui/icons-material";
import useNotificationStore from "../../store/notificationStore";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const iconMap = {
  success: CheckCircle,
  error: Error,
  warning: Warning,
  info: Info,
};

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: { xs: "calc(100vw - 32px)", sm: 400 },
          width: "auto",
          pointerEvents: "none",
        }}>
        {notifications.map((notification, index) => {
          const IconComponent = iconMap[notification.type] || Info;

          return (
            <Grow
              key={notification.id}
              in={true}
              timeout={300 + index * 100}
              style={{ transformOrigin: "top right" }}>
              <Box
                sx={{
                  pointerEvents: "auto",
                  width: "100%",
                }}>
                <Alert
                  severity={notification.type}
                  variant="filled"
                  icon={
                    <IconComponent
                      sx={{
                        animation:
                          notification.type === "success"
                            ? "bounce 0.6s ease"
                            : "none",
                        "@keyframes bounce": {
                          "0%, 20%, 53%, 80%, 100%": { transform: "scale(1)" },
                          "40%, 43%": { transform: "scale(1.2)" },
                          "70%": { transform: "scale(1.1)" },
                          "90%": { transform: "scale(1.05)" },
                        },
                      }}
                    />
                  }
                  action={
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={() => removeNotification(notification.id)}
                      sx={{
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "rotate(90deg) scale(1.1)",
                          bgcolor: "rgba(255,255,255,0.2)",
                        },
                      }}
                      aria-label="Close notification">
                      <Close fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    width: "100%",
                    minWidth: 280,
                    maxWidth: { xs: "calc(100vw - 32px)", sm: 400 },
                    borderRadius: 2,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    backdropFilter: "blur(8px)",
                    position: "relative",
                    overflow: "hidden",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))",
                      animation: notification.autoHide
                        ? `progress ${notification.duration}ms linear`
                        : "none",
                      "@keyframes progress": {
                        "0%": { transform: "scaleX(1)" },
                        "100%": { transform: "scaleX(0)" },
                      },
                    },
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                    },
                  }}>
                  <Box
                    sx={{
                      wordBreak: "break-word",
                      animation: "fadeInText 0.5s ease-out",
                      "@keyframes fadeInText": {
                        "0%": { opacity: 0, transform: "translateY(10px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                      },
                    }}>
                    {notification.message}
                  </Box>
                </Alert>
              </Box>
            </Grow>
          );
        })}
      </Box>
    </Portal>
  );
}
