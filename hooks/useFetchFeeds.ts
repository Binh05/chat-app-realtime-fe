import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { api } from "../utils/api";
import { FeedContext } from "../contexts/feedContext";

export const useFetchFeeds = (
  page: number = 1,
  limit: number = 10,
  userId?: string,
  autoFetch: boolean = true
) => {
  const { dispatch } = useContextSelector(FeedContext, (v) => v);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeeds = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (userId) {
        params.append("userId", userId);
      }

      const response = await api.get(`/feeds?${params.toString()}`);

      const feedsData = response.data?.feeds || response.data?.data || [];
      const total = response.data?.pagination?.total || feedsData.length;
      const currentPage = response.data?.pagination?.page || page;
      const currentLimit = response.data?.pagination?.limit || limit;

      // Ensure feedsData is array
      const feedsArray = Array.isArray(feedsData) ? feedsData : [];

      // Dispatch action để lưu feeds vào store
      dispatch({
        type: "SET_FEEDS",
        payload: {
          feeds: feedsArray,
          total,
          page: currentPage,
          limit: currentLimit,
        },
      });

      console.log(`Fetched ${feedsArray.length} feeds`);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to fetch feeds";
      setError(errorMsg);
      console.error("Error fetching feeds:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      loadFeeds();
    }
  }, [page, limit, userId, autoFetch]);

  return {
    loading,
    error,
    refetch: loadFeeds,
  };
};
