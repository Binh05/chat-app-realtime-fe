import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { View } from "react-native";

function Loading() {
  return (
    <View
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 998,
      }}
    >
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "#000",
          opacity: 0.7,
          zIndex: 998,
        }}
      ></View>
      <ActivityIndicator
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: 999,
          transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
        }}
        animating={true}
        color={MD2Colors.blueA100}
        size={"large"}
      />
    </View>
  );
}

export default Loading;
