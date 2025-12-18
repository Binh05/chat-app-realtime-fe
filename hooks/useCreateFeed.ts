import { useState } from "react";
import { useContextSelector } from "use-context-selector";
import { api } from "../utils/api";
import { FeedContext } from "../contexts/feedContext";

export const useCreateFeed = () => {
  const { dispatch } = useContextSelector(FeedContext, (v) => v);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFeed = async (title: string, imageUri?: string | null) => {
    if (!title.trim() && !imageUri) {
      setError("Nội dung hoặc ảnh là bắt buộc");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);

      if (imageUri) {
        formData.append("content", {
          uri: imageUri,
          name: `photo_${Date.now()}.jpg`,
          type: "image/jpeg",
        } as any);
      }

      const response = await api.post("/feeds", formData);
      const newFeed = response.data?.feed;

      if (newFeed) {
        dispatch({ type: "ADD_FEED", payload: newFeed });
        return newFeed;
      }

      return null;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể tạo bài viết";
      setError(msg);
      console.error("createFeed error:", msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createFeed,
    loading,
    error,
  };
};
