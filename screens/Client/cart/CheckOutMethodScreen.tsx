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
    <View style={{ marginHorizontal: 30 }}>
      <PrimaryButton
        title="CHECKOUT WITH CASH"
        onPress={() => {
          navigation.navigate("CheckOutCashScreen", {
            total: totalPrice,
            dataCart,
          });
        }}
      />
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
  );
};

export default CheckOutMethodScreen;
