import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { PrimaryButton } from "../../../components/PrimaryButton";

const CheckOutMethodScreen = ({ navigation, route }) => {
  const totalPrice = route.params.total;
  const dataCart = route.params.dataCart;

  return (
    <View style={{ marginHorizontal: 30, flex: 1, justifyContent: "center" }}>
      <View style={{ marginBottom: 40 }}>
        <Text style={{ fontSize: 30, textAlign: "center", fontWeight: "bold" }}>
          Select Payment Method
        </Text>
      </View>
      <View style={{}}>
        <View>
          <PrimaryButton
            title="CHECKOUT WITH CASH"
            onPress={() => {
              navigation.navigate("CheckOutCashScreen", {
                total: totalPrice,
                dataCart,
              });
            }}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <PrimaryButton
            title="CHECKOUT WITH ONLINE PAYMENT"
            onPress={() => {
              navigation.navigate("CheckOutScreen", {
                total: totalPrice,
                dataCart,
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default CheckOutMethodScreen;
