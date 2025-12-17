import { useState } from "react";
import { useContextSelector } from "use-context-selector";
import { api } from "../utils/api";
import { ChatContext } from "../contexts/chatContext";

export const useMarkAsRead = () => {
  const { dispatch } = useContextSelector(ChatContext, (v) => v);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = async (conversationId: string) => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.put(
        `/conversations/${conversationId}/markasread`
      );

      // Update frontend unreadCount to 0
      if (response.data?.unreadCounts) {
        dispatch({
          type: "UPDATE_UNREAD_COUNT",
          payload: {
            conversationId,
            unreadCounts: response.data.unreadCounts,
          },
        });
      }

      return response.data;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to mark as read";
      setError(errorMsg);
      console.error("❌ Error marking as read:", errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    markAsRead,
    loading,
    error,
  };
};
