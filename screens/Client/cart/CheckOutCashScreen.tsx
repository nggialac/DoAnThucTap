import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import { postOrder, postOrderCash } from "../../../api/OrderApis";
import { AuthContext } from "../../../components/ContextLogin";
// import Navigation from "../../../navigation";

const colors = {
  blurple: "#635BFF",
  blurple_dark: "#5851DF",
  white: "#FFFFFF",
  light_gray: "#F6F9FC",
  dark_gray: "#425466",
  slate: "#0A2540",
};

const CheckOutCashScreen = ({ navigation , route }) => {
  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  const totalPrice = route.params.total;
  const dataCart = route.params.dataCart;
  const [loading, setLoading] = useState(false);

  function requestData(dataCart) {
    const newArray = dataCart.map(function (v) {
      return {
        dongia: v.sanpham.dongia,
        masp: v.sanpham.masp,
        soluong: v.soluong,
      };
    });
    return newArray;
  }

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  const createOrders = async (manhathuoc: string, hinhthucthanhtoan: number, params) => {
    // const temp = [{params}]
    let check;
    setLoading(true);
    await postOrder(manhathuoc, hinhthucthanhtoan, params, "")
      .then((res) => {
        console.log(res.data);
        Alert.alert(`Congratulations`, "Order completed!" , [{
          text: "Ok!",
          onPress: () => navigation.navigate("TabClientHomeScreen"),
        }]);
        check = true;
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(`Error`, "Cannot create order! Could be not enough quantity for these item" + "");
        check = false;
        setLoading(false);
      });
    return check;
  };

  const onPressBuy=async()=>{
    const data = requestData(dataCart);
    await createOrders(nhathuoc.manhathuoc, 1, data);
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.text}>
          <Text style={styles.content}>Medical Store Payment</Text>
          <Text style={styles.content}>Method: Cash</Text>
          <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 100, marginRight: 20, alignItems: "center", textAlign:"right"}}>
            Total payment intent: {currencyFormat(totalPrice)}
          </Text>
          {/* <Text style={{ fontSize: 20 }}>Select your payment information</Text> */}
        </View>
      </View>

      <View style={styles.section}>
        <Button
          variant="primary"
          loading={loading}
          title="Buy"
          onPress={onPressBuy}
        />
      </View>
      {/* <View style={styles.section}>
        <Button
          variant="primary"
          loading={loading}
          title="Refund"
          onPress={refundButton}
        />
      </View> */}
    </View>
  );
};

export default CheckOutCashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 150,
  },
  content: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,

  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    marginTop: 200,
    marginHorizontal: 20
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  paymentMethodTitle: {
    color: colors.slate,
    fontWeight: "bold",
  },
  // image: {
  //   width: 26,
  //   height: 20,
  // },
  text: {
    marginTop: 100,
    color: colors.white,
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center"
  },
});
