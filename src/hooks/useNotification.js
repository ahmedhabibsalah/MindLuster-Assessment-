import useNotificationStore from "../store/notificationStore";

export const useNotification = () => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const showSuccess = (message) => {
    addNotification({
      type: "success",
      message,
      duration: 4000,
    });
  };

  const showError = (message) => {
    addNotification({
      type: "error",
      message,
      duration: 6000,
    });
  };

  const showWarning = (message) => {
    addNotification({
      type: "warning",
      message,
      duration: 5000,
    });
  };

  const showInfo = (message) => {
    addNotification({
      type: "info",
      message,
      duration: 4000,
    });
  };

  const showPersistent = (message, type = "info") => {
    addNotification({
      type,
      message,
      autoHide: false,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent,
  };
};
