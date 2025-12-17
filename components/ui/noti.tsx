import { StyleSheet, Text } from "react-native";
import { Snackbar } from "react-native-paper";

function Noti({
  message,
  onDismissSnackBar,
  type = "success",
}: {
  message: string | null;
  onDismissSnackBar: () => void;
  type?: "success" | "error";
}) {
  return (
    <Snackbar
      visible={!!message}
      onDismiss={onDismissSnackBar}
      duration={3000}
      style={[
        styles.snackbar,
        { backgroundColor: type === "success" ? "#5cb85c" : "#FF4444" },
      ]}
    >
      <Text>{message}</Text>
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    marginBottom: 80,
    marginHorizontal: 16,
    borderRadius: 8,
  },
});

export default Noti;
