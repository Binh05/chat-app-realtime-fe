import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { api } from "../utils/api";
import { ChatContext } from "../contexts/chatContext";

export const useFetchMessages = (
  conversationId: string,
  autoFetch: boolean = true
) => {
  const { dispatch } = useContextSelector(ChatContext, (v) => v);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages`
      );

      const messagesData = response.data?.messages || response.data || [];

      // Xác bảo messagesData là mảng
      const messagesArray = Array.isArray(messagesData) ? messagesData : [];

      // Dispatch action để lưu messages vào store
      dispatch({
        type: "SET_MESSAGES",
        payload: {
          roomId: conversationId,
          messages: messagesArray,
        },
      });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch messages";
      setError(errorMsg);
      console.error("❌ Error fetching messages:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && conversationId) {
      loadMessages();
    }
  }, [conversationId, autoFetch]);

  return {
    loading,
    error,
    refetch: loadMessages,
  };
};
