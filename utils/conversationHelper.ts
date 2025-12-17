import { format } from "date-fns";
// Helper tìm người kia trong cuộc trò chuyện
export const findOtherParticipant = (
  participants: any[],
  currentUserId: string
) => {
  // Tìm người có _id KHÁC với currentUserId
  return participants.find((p) => p._id !== currentUserId);
};

export const isValidConversation = (conversation: any) => {
  return (
    conversation &&
    Array.isArray(conversation.participants) &&
    conversation.participants.length >= 2
  );
};

export const convertConversationToChatItem = (
  conversation: any,
  currentUserId: string,
  isFriendOnline: (friendId: string) => boolean // Hàm check online từ hook
) => {
  // 1. Tìm thông tin người kia
  const otherParticipant = findOtherParticipant(
    conversation.participants,
    currentUserId
  );

  // Nếu không tìm thấy người kia (lỗi dữ liệu), return null để filter bỏ qua
  if (!otherParticipant) return null;

  // 2. Xử lý Avatar (Fallback nếu null)
  const avatarUrl =
    otherParticipant.avatarUrl || "https://i.pravatar.cc/150?img=3";

  // 3. Xử lý thời gian (Format cho đẹp)
  let timeDisplay = "";
  if (conversation.lastMessageAt) {
    const date = new Date(conversation.lastMessageAt);
    // Ví dụ: hiển thị giờ nếu là hôm nay, hiển thị ngày nếu cũ hơn (tùy chỉnh library date-fns)
    timeDisplay = format(date, "HH:mm");
  }

  // 4. Xử lý tin nhắn cuối
  const lastMsgContent = conversation.lastMessage
    ? conversation.lastMessage.content
    : "Bắt đầu cuộc trò chuyện";

  // 5. Xử lý Unread Count (Badge)
  // Backend trả về: "unreadCounts": { "userIdA": 0, "userIdB": 1 }
  const unreadCount = conversation.unreadCounts
    ? conversation.unreadCounts[currentUserId] || 0
    : 0;

  // Trả về object đúng form mà FlatList trong MessagePage đang dùng
  return {
    _id: conversation._id,
    type: conversation.type || "direct", // 'direct' hoặc 'group'
    name: otherParticipant.username, // Tên người kia
    img: avatarUrl, // Ảnh người kia
    message: lastMsgContent,
    time: timeDisplay,
    badge: unreadCount,
    isOnline: isFriendOnline(otherParticipant._id),
    otherUser: otherParticipant, // Lưu lại để dùng khi navigate sang trang Detail
  };
};
