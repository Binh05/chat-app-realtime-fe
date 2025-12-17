import { useCallback, useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { FriendContext } from "../contexts/FriendContext";
import { SocketContext } from "../contexts/socketContext";
import { api } from "../utils/api";

interface UseFetchFriendsOptions {
  autoFetch?: boolean;
  onError?: (error: any) => void;
}

/**
 * Hook to fetch friend list and track online status
 * - Fetches friends list from API
 * - Automatically updates when online users list changes
 * - Provides methods to get online friends
 */
export const useFetchFriends = (options: UseFetchFriendsOptions = {}) => {
  const { autoFetch = true, onError } = options;

  const { setFriends, state: friendState } = useContextSelector(
    FriendContext,
    (v) => v
  );
  const { state: socketState } = useContextSelector(SocketContext, (v) => v);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch friends list - không có friendState.isLoaded trong dependency
  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/friends");

      if (response.data.friends) {
        setFriends(response.data.friends);
      }

      setLoading(false);
      return response.data.friends;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load friends";
      console.error("❌ Error loading friends:", errorMessage);
      setError(errorMessage);
      onError?.(err);
      setLoading(false);
      throw err;
    }
  }, [setFriends, onError]);

  // Chỉ fetch khi mount, nếu chưa từng load thành công
  useEffect(() => {
    if (
      autoFetch &&
      !friendState.isLoaded &&
      friendState.friends.length === 0
    ) {
      loadFriends().catch((e) => console.error(e));
    }
  }, [autoFetch]);

  // Listen to friend status changes (unfriend, accept friend request)
  useEffect(() => {
    if (socketState.friendStatusChanged) {
      loadFriends().catch((e) => console.error(e));
    }
  }, [socketState.friendStatusChanged, loadFriends]);

  // Get online friends
  const getOnlineFriends = useCallback(() => {
    return friendState.friends.filter((friend: any) =>
      socketState.onlineUsers.includes(friend._id)
    );
  }, [friendState.friends, socketState.onlineUsers]);

  // Check if friend is online
  const isFriendOnline = useCallback(
    (friendId: string) => {
      return socketState.onlineUsers.includes(friendId);
    },
    [socketState.onlineUsers]
  );

  return {
    friends: friendState.friends,
    loading,
    error,
    onlineFriends: getOnlineFriends(),
    loadFriends,
    refetch: loadFriends,
    isFriendOnline,
    onlineUsersCount: socketState.onlineUsers.length,
  };
};

/**
 * Hook to search and filter friends
 */
export const useFriendsSearch = (searchText: string) => {
  const { state: friendState } = useContextSelector(FriendContext, (v) => v);

  const filteredFriends = friendState.friends.filter(
    (friend: any) =>
      friend.username?.toLowerCase().includes(searchText.toLowerCase()) ?? false
  );

  return filteredFriends;
};
