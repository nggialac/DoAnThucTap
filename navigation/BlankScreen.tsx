import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../components/ContextLogin";

export default function BlackScreen() {
  const context = React.useContext(AuthContext);
  // const nhathuoc = JSON.parse(context.loginState.mnv_mnt);

  const checkHandle = () => {
    context.authContext.check();
  };

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={{
            uri: "https://cdn.iconscout.com/icon/premium/png-256-thumb/file-permission-1728784-1468673.png",
          }}
          style={styles.image}
        />
      </View>
      <View>
        <Text style={styles.successTextStyle}>You are not login yet!</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={checkHandle}
        >
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#307ecc",
    justifyContent: "center",
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    height: 150,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
});
