import React, { useState } from "react";
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

  // Chọn danh sách dựa theo chế độ filter
  const filteredUsers = filterPhone
    ? othersList.filter((user) => user.phone.includes(searchText))
    : userList.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );

  const [currentTab, setCurrentTab] = useState("contacts");

  return (
    <View style={{ flex: 1 }}>
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
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortBtnText}>A → Z</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterBtn,
                filterPhone && { backgroundColor: "#00B4D8" },
              ]}
              onPress={() => {
                setFilterPhone(!filterPhone);
                setSearchText("");
              }}
            >
              <Text
                style={[styles.filterText, filterPhone && { color: "#fff" }]}
              >
                {filterPhone ? "Phone" : "Filter"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* User List */}
        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.avatar} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.field}>{item.field}</Text>

                {/* Action buttons based on mode */}
                <View style={styles.actionRow}>
                  {filterPhone ? (
                    // Add button in phone filter mode
                    <>
                      <TouchableOpacity
                        style={[styles.infoBtn, { borderColor: "green" }]}
                        onPress={() => {
                          setUserList([...userList, item]); // thêm bạn
                          setOthersList(
                            othersList.filter((x) => x.id !== item.id)
                          );
                        }}
                      >
                        <Text style={[styles.infoBtnText, { color: "green" }]}>
                          Add
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
                        onPress={() => {
                          setSelectedUser(item);
                          setConfirmVisible(true);
                        }}
                      >
                        <Text style={styles.infoBtnText}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
        />

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

      {/* TASKBAR */}
      <TaskBar
        current={currentTab}
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
