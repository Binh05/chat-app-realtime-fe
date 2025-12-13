import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { View } from "react-native";

function LoadingInit({
  width,
  height,
}: {
  width?: number | "auto" | "100%";
  height?: number | "auto" | "100%";
}) {
  return (
    <View style={{ width, height }}>
      <ActivityIndicator
        style={{
          top: "50%",
          left: "50%",
          zIndex: 999,
          transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
        }}
        animating={true}
        color={MD2Colors.blueA100}
        size={"small"}
      />
    </View>
  );
}

export default LoadingInit;
