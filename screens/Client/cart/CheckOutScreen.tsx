import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import Button from "./Button";
import PaymentScreen from "./PaymentScreen";
import { API_URL } from "./Config";
//
import { cancelOrder, deleteOrderById, postOrder } from "../../../api/OrderApis";
import { AuthContext } from "../../../components/ContextLogin";
const colors = {
  blurple: "#635BFF",
  blurple_dark: "#5851DF",
  white: "#FFFFFF",
  light_gray: "#F6F9FC",
  dark_gray: "#425466",
  slate: "#0A2540",
};

export default function PaymentsUICustomScreen({ navigation, route }) {
  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  const [madh, setMadh] = useState();
  const [createdTime, setCreatedTime] = useState(0);
  // console.log(nhathuoc);

  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } =
    useStripe();

  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<{
    image: string;
    label: string;
  } | null>(null);

  const totalPrice = route.params.total;
  const dataCart = route.params.dataCart;
  const [payment_intent_fetched, setPayment_intent_fetched] = useState("");
  // console.log(route.params.);

  const fetchPaymentSheetParams = async () => {
    console.log(totalPrice);
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total: totalPrice,
        // request_three_d_secure: 'any',
      }),
    });
    const { paymentIntent, ephemeralKey, customer, paymentIntentId, paymentIntentCreated } =
      await response.json();

    // payment_intent_fetched = paymentIntent;
    // console.log(payment_intent_fetched);

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      paymentIntentId,
      paymentIntentCreated,
    };
  };

  const callNoWebhookPayEndpoint = async (
    data:
      | {
          useStripeSdk: boolean;
          paymentMethodId: string;
          currency: string;
          items: { id: string }[];
        }
      | { paymentIntentId: string }
  ) => {
    const response = await fetch(`${API_URL}/pay-without-webhooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const createOrders = async (manhathuoc: string, params, pi: string) => {
    // const temp = [{params}]
    // console.log(created)
    // let hinhthucthanhtoan = created;
    let check;
    await postOrder(manhathuoc, 2, params, pi)
      .then((res) => {
        console.log(res.data);
        setMadh(res.data);
        check = true;
      })
      .catch((e) => {
        console.log(manhathuoc, params, pi);
        console.log(e);
        // Alert.alert(`Error`, e + "");
        check = false;
      });
    return check;
  };

  const cancelPayment = (madh) => {
    cancelOrder(madh, "")
    .then(async (res) => {
      console.log(res.data);
      await deleteOrderById(madh);
    })
    .catch((e) => {
      console.log(e);
      Alert.alert("Failed!", "Cannot cancel");
    })
  }

  const deleteAOrder = (madh: string) => {
    deleteOrderById(madh)
    .then((res) => {
      console.log(res.data);
    })
    .catch((e) => {
      console.log(e);
      Alert.alert(`Error`, e + "");
    });
  }

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

  const initialisePaymentSheet = async () => {
    setLoading(true);
    try {
      const { paymentIntent, ephemeralKey, customer, paymentIntentId, paymentIntentCreated } =
        await fetchPaymentSheetParams();

      setPayment_intent_fetched(paymentIntentId);
      setCreatedTime(paymentIntentCreated);
      // console.log(payment_intent_fetched);

      const { error, paymentOption } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        customFlow: true,
        merchantDisplayName: "Medical Ecom Inc.",
        applePay: true,
        merchantCountryCode: "VN",
        style: "alwaysDark",
        googlePay: true,
        testEnv: true,
      });
      if (!error) {
        setPaymentSheetEnabled(true);
      }
      if (paymentOption) {
        setPaymentMethod(paymentOption);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const choosePaymentOption = async () => {
    const { error, paymentOption } = await presentPaymentSheet({
      confirmPayment: false,
    });

    if (error) {
      console.log("error", error);
    } else if (paymentOption) {
      setPaymentMethod({
        label: paymentOption.label,
        image: paymentOption.image,
      });
    } else {
      setPaymentMethod(null);
    }
  };

  // const onPressBuyTest = async () => {
  //   setLoading(true);
  //   const {
  //     clientSecret,
  //     error: paymentIntentError,
  //     requiresAction,
  //   } = await callNoWebhookPayEndpoint({
  //     paymentIntentId: payment_intent_fetched,
  //   });

  //   if (paymentIntentError) {
  //     // Error during creating or confirming Intent
  //     Alert.alert("Error", paymentIntentError);
  //     return;
  //   }

  //   if (clientSecret && !requiresAction) {
  //     // Payment succedeed
  //     Alert.alert("Success", "The payment was confirmed successfully!");
  //   }
  // };

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  const onPressBuy = async () => {
    setLoading(true);
    const data = requestData(dataCart);
    let check = await createOrders(nhathuoc.manhathuoc, data, payment_intent_fetched);
    // const check = true;
    if(check === false) {
      Alert.alert("Error", "We are not enough quantity of this product!");
    } else {
    const { error } = await confirmPaymentSheetPayment();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      // await cancelPaymentIntent
      cancelPayment(madh);
    } else {
      Alert.alert("Success", "The payment was confirmed successfully!");
      // setPaymentSheetEnabled(false);
      setLoading(false);
      navigation.navigate("TabClientHomeScreen");
    }
  }
  };

  const doRefund = async (pi: string) => {
    try{
    const response = await fetch(`${API_URL}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // created: created,
        pi
        // request_three_d_secure: 'any',
      }),
    });
    // const { status } = await response.json();
  }
  catch(e){
    Alert.alert("Fail", ""+ e);
  }

  Alert.alert("Success", "Refund Complete !");
    

    // return {
    //   status,
    // };
  };

  const refundButton = () => {
    doRefund(payment_intent_fetched);
  };

  useEffect(() => {
    // In your app’s checkout, make a network request to the backend and initialize PaymentSheet.
    // To reduce loading time, make this request before the Checkout button is tapped, e.g. when the screen is loaded.
    initialisePaymentSheet();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentScreen>
      <View style={styles.container}>
        <View style={styles.text}>
          <Text style={styles.content}>Medical E-Commerce Payment</Text>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Total must pay: {currencyFormat(totalPrice)}
          </Text>
          <Text style={{ fontSize: 20 }}>Select your payment information</Text>
        </View>
        <Button
          variant="primary"
          loading={loading}
          title={
            paymentMethod ? (
              <View style={styles.row}>
                <Image
                  source={{
                    uri: `data:image/png;base64,${paymentMethod.image}`,
                  }}
                  style={styles.image}
                />
                <Text style={styles.text}>{paymentMethod.label}</Text>
              </View>
            ) : (
              "Choose payment method"
            )
          }
          disabled={!paymentSheetEnabled}
          onPress={choosePaymentOption}
        />
      </View>

      <View style={styles.section}>
        <Button
          variant="primary"
          loading={loading}
          disabled={!paymentMethod || !paymentSheetEnabled}
          title="Buy"
          onPress={onPressBuy}
        />
      </View>
      {/* <View style={styles.section}>
        <Button
          variant="primary"
          loading={loading}
          disabled={!paymentMethod || !paymentSheetEnabled}
          title="Refund"
          onPress={refundButton}
        />
      </View> */}
    </PaymentScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 50,
  },
  content: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    marginTop: 40,
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
  image: {
    width: 26,
    height: 20,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
});
