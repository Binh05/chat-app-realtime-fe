import { StyleSheet, Text } from "react-native";
import { Snackbar } from "react-native-paper";

function Noti({
  message,
  onDismissSnackBar,
}: {
  message: string;
  onDismissSnackBar: () => void;
}) {
  return (
    <Snackbar
      visible={!!message}
      onDismiss={onDismissSnackBar}
      duration={3000}
      style={[styles.snackbar, { backgroundColor: "#5cb85c" }]}
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
