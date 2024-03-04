export async function sendBrowserNotification(title: string, body: string, users: string[]) {
      try {
            await fetch("https://notification-hub.pancakeswap.com/broadcast-notifications", {
                  method: "POST",
                  body: JSON.stringify({
                        notification: { title, body },
                        users,
                  }),
                  headers: {
                        "Content-Type": "application/json",
                        "x-secure-token": "nTu3Ls0rJzW7cVpRyZkFgUqHxJ3i1sXo",
                  },
            });
      } catch (error: any) {
            console.error("Failed to send browser notification", error.message);
      }
}
