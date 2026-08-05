import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const API_URL = "https://command-center-backend-dvol.onrender.com";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function buildNotificationBody(token: string) {
  const [noteRes, eventsRes] = await Promise.all([
    fetch(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${API_URL}/events/${formatDate(new Date())}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const note = await noteRes.json();
  const events = await eventsRes.json();

  let body = "";

  if (note?.content) {
    body += `📝 ${note.content}`;
  }

  if (events.length > 0) {
    if (body) body += "\n";
    body += `📅 ${events.map((e: any) => e.text).join(", ")}`;
  }

  if (!body) {
    body = "Καμία σημείωση ή event για σήμερα.";
  }

  return body;
}

export default function useNotificationSetup(token: string | null) {
  useEffect(() => {
    if (!token) return;

    async function setup(validToken: string) {
      if (!Device.isDevice) return;

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") return;

      const body = await buildNotificationBody(validToken);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Command Center",
          body,
        },
        trigger: null,
      });
    }

    setup(token).catch((err) => console.error("Σφάλμα notifications:", err));
  }, [token]);
}
