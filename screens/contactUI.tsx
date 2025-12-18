import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import TaskBar from "../components/TaskBar";
import { useRoute } from "@react-navigation/native";
import { api } from "../utils/api";
import { useContextSelector } from "use-context-selector";
import { FriendContext } from "../contexts/FriendContext";
import LoadingInit from "../components/ui/loadingInit";
import { Friend, Send } from "../reducers/friendReducer";
import { Snackbar } from "react-native-paper";
import Noti from "../components/ui/noti";
import Loading from "../components/ui/loading";

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function DoctorListScreen({ navigation }: Props) {
  const users = [
    {
      id: 1,
      name: "Dr. Hannah Lewis, M.D.",
      field: "Dermatopathology",
      img: "https://i.pravatar.cc/150?img=12",
      phone: "0983123456",
    },
    {
      id: 2,
      name: "Dr. Jacob Lopez, M.D.",
      field: "Surgical Dermatology",
      img: "https://i.pravatar.cc/150?img=48",
      phone: "0974567890",
    },
    {
      id: 3,
      name: "Dr. Lucy Perez, Ph.D.",
      field: "Clinical Dermatology",
      img: "https://i.pravatar.cc/150?img=15",
      phone: "0912345678",
    },
    {
      id: 4,
      name: "Dr. Logan Williams, M.D.",
      field: "Dermatology",
      img: "https://i.pravatar.cc/150?img=25",
      phone: "0939988776",
    },
  ];

  //   Danh sách bạn chưa kết bạn
  const strangers = [
    {
      id: 101,
      name: "Dr. Tony Smith",
      field: "Pediatrics",
      img: "https://i.pravatar.cc/150?img=60",
      phone: "0988001122",
    },
    {
      id: 102,
      name: "Dr. Angela Stone",
      field: "Dermatology",
      img: "https://i.pravatar.cc/150?img=62",
      phone: "0955667788",
    },
  ];

  const [userList, setUserList] = useState(users);
  const [othersList, setOthersList] = useState(strangers);

  const [infoVisible, setInfoVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [filterPhone, setFilterPhone] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [showInvites, setShowInvites] = useState(false);

  // Chọn danh sách dựa theo chế độ filter
  const filteredUsers = showInvites
    ? othersList // danh sách lời mời kết bạn
    : filterPhone
    ? othersList.filter((user) => user.phone.includes(searchText))
    : userList.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );

  const [currentTab, setCurrentTab] = useState("contacts");
  const route = useRoute();
  const routeToKey: Record<string, string> = {
    Home: "home",
    Message: "messages",
    Contacts: "contacts",
    Profile: "profile",
  };

  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");

  const { friends, notFriends, sends, receiveds } = useContextSelector(
    FriendContext,
    (v) => v.state
  );
  const {
    state,
    addFriend,
    removeFriend,
    setFriends,
    setNotFriends,
    setSends,
    setReceiveds,
    addSend,
    removeSend,
    addNotFriend,
    removeNotFriend,
  } = useContextSelector(FriendContext, (v) => v);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingFetch(true);

        const [friendRes, friendRequestRes, notFriendRes] = await Promise.all([
          api.get("/friends"),
          api.get("/friends/requests"),
          api.get("/friends/notfriends"),
        ]);

        setFriends(friendRes.data.friends);
        setNotFriends(notFriendRes.data.users);
        setSends(friendRequestRes.data.send);
        setReceiveds(friendRequestRes.data.received);
      } catch (err: any) {
        console.error(err);
        console.log(err.response?.data?.message);
      } finally {
        setError(null);
        setLoadingFetch(false);
      }
    };

    fetchData();
  }, []);
  const [userlist, setUserlist] = useState<any[]>([]);

  const userss = React.useMemo(() => {
    const notfriendlist = notFriends.map((nf: Friend) => ({
      ...nf,
      type: "notfriend",
    }));

    const sendlist = sends.map((s: Send) => ({
      ...s.to,
      requestId: s._id,
      type: "send",
    }));

    return [...sendlist, ...notfriendlist];
  }, [notFriends, sends]);

  React.useEffect(() => {
    setUserlist(userss);
  }, [userss]);

  React.useEffect(() => {
    if (!searchText.trim()) {
      setUserlist(userss);
      return;
    }

    const filtered = userss.filter((user) => user.phone?.includes(searchText));

    setUserlist(filtered);
  }, [searchText, userss]);

  const declineFriendRequest = async (friendRequestId: string) => {
    try {
      setLoading(true);
      const res = await api.post(
        `/friends/requests/${friendRequestId}/decline`
      );

      setReceiveds(receiveds.filter((r: any) => r._id !== friendRequestId));
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  const acceptFriendRequest = async (friendRequestId: string) => {
    try {
      setLoading(true);
      const res = await api.post(`/friends/requests/${friendRequestId}/accept`);

      addFriend(res.data.newFriend);
      setReceiveds(receiveds.filter((r: any) => r._id !== friendRequestId));
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  const unfriend = async (friendId: string) => {
    try {
      setLoading(true);
      await api.delete(`/friends/${friendId}/unfriend`);

      removeFriend(friendId);
    } catch (error: any) {
      console.error("Loi khi unfriend", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi, hãy thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friend: Friend) => {
    try {
      setLoading(true);

      const res = await api.post("/friends/requests", { to: friend._id });
      const newSend: Send = res.data.request;

      removeNotFriend(friend._id);
      addSend(newSend);

      setSuccess(res.data.message);
    } catch (error: any) {
      setError(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      setLoading(true);

      const send = state.sends.find((s: any) => s._id === requestId);
      if (!send) return;

      await api.post(`/friends/requests/${requestId}/cancel`);

      removeSend(requestId);
      addNotFriend(send.to);

      setSuccess("Đã huỷ lời mời kết bạn");
    } catch (error: any) {
      setError(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const onDismissSnackBar = () => setError(null);
  const onDismissSnackBarNoti = () => setSuccess("");

  return (
    <View style={{ flex: 1 }}>
      {loading && <Loading />}
      <View style={styles.container}>
        {/* Search */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#7f8c8d" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={
              filterPhone ? "   Search by phone number..." : "   Search..."
            }
            placeholderTextColor="#aaa"
            keyboardType={filterPhone ? "numeric" : "default"}
            style={styles.searchInput}
          />
        </View>

        {/* Sort by and filter */}
        <View style={styles.rowBetween}>
          <Text style={styles.sortText}>Sort By</Text>

          <View style={styles.row}>
            {/* Sort A-Z */}
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortBtnText}>A → Z</Text>
            </TouchableOpacity>

            {/* Filter */}
            <TouchableOpacity
              style={[
                styles.filterBtn,
                filterPhone && { backgroundColor: "#00B4D8" },
              ]}
              onPress={() => {
                setFilterPhone(!filterPhone);
                setShowInvites(false);
                setSearchText("");
              }}
            >
              <Text
                style={[styles.filterText, filterPhone && { color: "#fff" }]}
              >
                {filterPhone ? "Phone" : "Filter"}
              </Text>
            </TouchableOpacity>

            {/* Accept Button */}
            <TouchableOpacity
              style={[
                styles.acceptBtn,
                showInvites && { backgroundColor: "#0077B6" },
              ]}
              onPress={() => {
                setShowInvites(!showInvites);
                setFilterPhone(false);
                setSearchText("");
              }}
            >
              <Text
                style={[styles.acceptBtnText, showInvites && { color: "#fff" }]}
              >
                Accept
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* User List */}
        {loadingFetch ? (
          <LoadingInit />
        ) : (
          <FlatList
            data={showInvites ? receiveds : filterPhone ? userlist : friends}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/dyt536gfk/image/upload/v1765996624/avatar_e9pjjr.jpg",
                  }}
                  style={styles.avatar}
                />

                <View style={styles.info}>
                  <Text style={styles.name}>
                    {showInvites
                      ? item.from.username
                      : filterPhone
                      ? item.username
                      : item.username}
                  </Text>
                  {/* <Text style={styles.field}>{item.field}</Text> */}

                  {/* Action buttons based on mode */}
                  <View style={styles.actionRow}>
                    {showInvites ? (
                      <>
                        <TouchableOpacity
                          style={styles.infoBtn}
                          onPress={() => {
                            setSelectedUser(item);
                            setInfoVisible(true);
                          }}
                        >
                          <Text style={styles.infoBtnText}>Info</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.infoBtn, { borderColor: "green" }]}
                          onPress={() => acceptFriendRequest(item._id)}
                        >
                          <Text
                            style={[styles.infoBtnText, { color: "green" }]}
                          >
                            Accept
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.deleteBtn]}
                          onPress={() => declineFriendRequest(item._id)}
                        >
                          <Text style={[styles.infoBtnText, { color: "red" }]}>
                            Ignore
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : filterPhone ? (
                      // Add button in phone filter mode
                      <>
                        <TouchableOpacity
                          style={[styles.infoBtn, { borderColor: "green" }]}
                          onPress={() =>
                            item.type === "notfriend"
                              ? sendFriendRequest(item)
                              : cancelFriendRequest(item.requestId)
                          }
                        >
                          <Text
                            style={[styles.infoBtnText, { color: "green" }]}
                          >
                            {item.type === "notfriend" ? "Add" : "cancel"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.infoBtn}
                          onPress={() => {
                            setSelectedUser(item);
                            setInfoVisible(true);
                          }}
                        >
                          <Text style={styles.infoBtnText}>Info</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      // Regular mode → Info + Delete
                      <>
                        <TouchableOpacity
                          style={styles.infoBtn}
                          onPress={() => {
                            setSelectedUser(item);
                            setInfoVisible(true);
                          }}
                        >
                          <Text style={styles.infoBtnText}>Info</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => unfriend(item._id)}
                          disabled={loading}
                        >
                          <Text style={styles.infoBtnText}>Unfriend</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            )}
          />
        )}

        {/* Modal Info */}
        {selectedUser && (
          <Modal
            visible={infoVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setInfoVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Image
                  source={{ uri: selectedUser.img }}
                  style={styles.modalAvatar}
                />
                <Text style={styles.modalName}>{selectedUser.name}</Text>
                <Text style={styles.modalField}>{selectedUser.field}</Text>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setInfoVisible(false)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Modal Delete */}
        <Modal
          visible={confirmVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text
                style={{ fontSize: 16, fontWeight: "600", marginBottom: 15 }}
              >
                Xác nhận xóa {selectedUser?.name}?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: "#ccc" }]}
                  onPress={() => setConfirmVisible(false)}
                >
                  <Text style={[styles.closeText, { color: "#333" }]}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => {
                    setUserList(
                      userList.filter((user) => user.id !== selectedUser.id)
                    );
                    setConfirmVisible(false);
                  }}
                >
                  <Text style={styles.closeText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <Noti message={success} onDismissSnackBar={onDismissSnackBarNoti} />
      <Snackbar
        visible={!!error}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={[styles.snackbar, { backgroundColor: "#FF4444" }]}
      >
        <Text>{error}</Text>
      </Snackbar>

      {/* TASKBAR */}
      <TaskBar
        current={routeToKey[route.name] || "home"}
        onChange={(key) => {
          setCurrentTab(key);
          if (key === "home") navigation.navigate("Home");
          if (key === "messages") navigation.navigate("Message");
          if (key === "contacts") navigation.navigate("Contacts");
          if (key === "profile") navigation.navigate("Profile");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    marginBottom: 80,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  container: {
    paddingTop: 55,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flex: 1,
  },

  searchWrapper: {
    backgroundColor: "#f1f1f1",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 42,
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    paddingLeft: 5,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  sortText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  sortBtn: {
    backgroundColor: "#00B4D8",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 18,
    marginRight: 10,
  },

  sortBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  filterBtn: {
    borderWidth: 1,
    borderColor: "#00B4D8",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 18,
  },

  filterText: {
    color: "#00B4D8",
    fontWeight: "600",
  },

  acceptBtn: {
    borderWidth: 1,
    borderColor: "#0077B6",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 18,
    marginLeft: 10,
  },

  acceptBtnText: {
    color: "#0077B6",
    fontWeight: "600",
  },

  seeAll: {
    color: "#00B4D8",
    fontWeight: "500",
  },

  card: {
    flexDirection: "row",
    marginBottom: 28,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 50,
    marginRight: 15,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0077B6",
  },

  field: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoBtn: {
    borderWidth: 1,
    borderColor: "#00B4D8",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 15,
  },

  deleteBtn: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 15,
  },

  infoBtnText: {
    color: "#00B4D8",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },

  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 12,
  },

  modalName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#0077B6",
  },

  modalField: {
    fontSize: 14,
    marginBottom: 20,
    color: "#555",
  },

  closeBtn: {
    backgroundColor: "#00B4D8",
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 20,
  },

  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
