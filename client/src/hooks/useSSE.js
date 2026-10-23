
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Do not connect when the user is logged out
    if (!user) return;

    // Open the SSE connection
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // Receive notifications from the server
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("[useSSE] parse error:", event.data);
      }
    };

    // Handle connection errors
    source.onerror = (error) => {
      console.error("[useSSE] error:", error);
    };

    // Close the connection when needed
    return () => source.close();
  }, [url, user, onMessage]);
}
