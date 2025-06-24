import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useNotificationStore = create()(
  devtools(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
          id,
          type: "info",
          autoHide: true,
          duration: 4000,
          ...notification,
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        if (newNotification.autoHide) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }

        return id;
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "notification-store",
    }
  )
);

export default useNotificationStore;
