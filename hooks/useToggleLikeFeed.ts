import { useState } from "react";
import { useContextSelector } from "use-context-selector";
import { api } from "../utils/api";
import { FeedContext } from "../contexts/feedContext";

export const useToggleLikeFeed = () => {
  const { dispatch } = useContextSelector(FeedContext, (v) => v);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = async (feedId: string) => {
    if (!feedId) {
      setError("Feed ID là bắt buộc");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/feeds/${feedId}/like`);

      const updatedFeed = response.data?.feed;

      if (updatedFeed) {
        // Dispatch action để update feed trong store
        dispatch({
          type: "TOGGLE_LIKE_FEED",
          payload: updatedFeed,
        });

        console.log("✅ Feed like toggled successfully");
        return updatedFeed;
      }

      return null;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to toggle like";
      setError(errorMsg);
      console.error("❌ Error toggling like:", errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleLike,
    loading,
    error,
  };
};
