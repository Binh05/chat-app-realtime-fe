import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function CallingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.pravatar.cc/300?img=50" }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Your Friend</Text>
      <Text style={styles.status}>Calling...</Text>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="mic-off-outline" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCall} onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={34} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="volume-high-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Accept button */}
      <TouchableOpacity style={styles.acceptBtn}>
        <Ionicons name="call-outline" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    alignItems: "center",
    paddingTop: 80,
  },
  avatar: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: width * 0.28,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
  },
  status: {
    fontSize: 18,
    color: "#aaa",
    marginTop: 6,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 60,
  },
  actionBtn: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 50,
  },
  endCall: {
    backgroundColor: "#ff3b30",
    padding: 20,
    borderRadius: 50,
  },
  acceptBtn: {
    backgroundColor: "#28c76f",
    marginTop: 40,
    padding: 20,
    borderRadius: 50,
  },
});
