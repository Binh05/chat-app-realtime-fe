import { useCallback, useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { ChatContext } from "../contexts/chatContext";
import { SocketContext } from "../contexts/socketContext";
import { api } from "../utils/api"; // Đảm bảo bạn đã import api

interface UseFetchConversationsOptions {
  autoFetch?: boolean;
  onError?: (error: any) => void;
}

export const useFetchConversations = (
  options: UseFetchConversationsOptions = {}
) => {
  const { autoFetch = true, onError } = options;

  // SỬA: Chỉ lấy state và dispatch, không lấy fetchConversations từ context nữa
  const { state: chatState, dispatch } = useContextSelector(
    ChatContext,
    (v) => v
  );

  const { state: socketState, joinConversation } = useContextSelector(
    SocketContext,
    (v) => v
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SỬA: Viết hàm call API trực tiếp tại đây
  const loadConversations = useCallback(async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);

      if (chatState.isLoaded && chatState.conversations.length > 0) {
        setLoading(false);
        return chatState.conversations;
      }

      // GỌI API TRỰC TIẾP
      const response = await api.get("/conversations");
      const data = response.data;

      const conversationArray = Array.isArray(data) ? data : data.conversations;

      // Dispatch vào Context để lưu global state
      dispatch({ type: "SET_CONVERSATIONS", payload: conversationArray });

      setLoading(false);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load conversations";
      setError(errorMessage);
      onError?.(err);
      setLoading(false);
      throw err;
    }
  }, [
    dispatch,
    onError,
    loading,
    chatState.isLoaded,
    chatState.conversations.length,
  ]);

  // ... (Phần logic Socket giữ nguyên) ...
  useEffect(() => {
    if (socketState.socket?.connected && chatState.conversations.length > 0) {
      chatState.conversations.forEach((conversation: any) => {
        joinConversation(conversation._id);
      });
    }
  }, [
    socketState.socket?.connected,
    chatState.conversations,
    joinConversation,
  ]);

  useEffect(() => {
    if (autoFetch && !chatState.isLoaded) {
      loadConversations();
    }
  }, [autoFetch, chatState.isLoaded]);

  // Listen to friend status changes (unfriend, accept friend request)
  // Refetch conversations khi có thay đổi friend status
  useEffect(() => {
    if (socketState.friendStatusChanged) {
      loadConversations().catch((e) => console.error(e));
    }
  }, [socketState.friendStatusChanged]);

  return {
    conversations: chatState.conversations,
    isLoaded: chatState.isLoaded,
    loading,
    error,
    loadConversations,
    refetch: loadConversations,
  };
};

// ... (Giữ nguyên phần useConversationSearch và useConversationOnlineStatus)
