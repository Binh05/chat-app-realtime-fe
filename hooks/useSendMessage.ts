import { useState } from "react";
import { useContextSelector } from "use-context-selector";
import { api } from "../utils/api";
import { ChatContext } from "../contexts/chatContext";

export const useSendMessage = () => {
  const { dispatch } = useContextSelector(ChatContext, (v) => v);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    conversationId: string,
    recipientId: string,
    content: string
  ) => {
    if (!conversationId || !recipientId || !content.trim()) {
      setError("Missing required fields");
      return null;
    }

    setSending(true);
    setError(null);

    try {
      const response = await api.post("/messages/direct", {
        conversationId,
        recipientId,
        content,
      });

      const newMessage = response.data?.message || response.data;

      // Dispatch action để thêm message vào store
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: newMessage._id,
          roomId: conversationId,
          senderId: newMessage.senderId,
          text: newMessage.content,
          createdAt: newMessage.createdAt,
          ...newMessage,
        },
      });

      return newMessage;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to send message";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  return {
    sendMessage,
    sending,
    error,
  };
};
