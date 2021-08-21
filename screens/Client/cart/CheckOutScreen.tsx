import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import Button from "./Button";
import PaymentScreen from "./PaymentScreen";
import { API_URL } from "./Config";
//
import { postOrder } from "../../../api/OrderApis";
import { AuthContext } from "../../../components/ContextLogin";
const colors = {
  blurple: "#635BFF",
  blurple_dark: "#5851DF",
  white: "#FFFFFF",
  light_gray: "#F6F9FC",
  dark_gray: "#425466",
  slate: "#0A2540",
};

export default function PaymentsUICustomScreen({ route }) {
  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
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
  var payment_intent_fetched;
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
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    payment_intent_fetched = paymentIntent;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const createOrders = async (manhathuoc: string, params) => {
    // const temp = [{params}]
    let check;
    await postOrder(manhathuoc, params)
      .then((res) => {
        console.log(res.data);
        check = true;
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(`Error`, e + "");
        check = false;
      });
    return check;
  };

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
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error, paymentOption } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        customFlow: true,
        merchantDisplayName: "Medical Ecom Inc.",
        applePay: true,
        merchantCountryCode: "US",
        style: "alwaysDark",
        googlePay: true,
        testEnv: true,
      });
      // console.log("PAYMENT INTENT");
      // console.log(paymentIntent);

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

  const onPressBuy = async () => {
    setLoading(true);
    const { error } = await confirmPaymentSheetPayment();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "The payment was confirmed successfully!");
      // setPaymentSheetEnabled(false);

      //CreateOrder
      const data = requestData(dataCart);
      let check = await createOrders(nhathuoc.manhathuoc, data);
      // if(check === false) {
      //   // refundPayment
      // }

      setLoading(false);
    }
  };

  const doRefund = async (pi: string) =>{
    const response = await fetch(`${API_URL}/pi/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pi: pi,
        // request_three_d_secure: 'any',
      }),
    });
    const { paymentIntent } = await response.json();

    return {
      paymentIntent
    };
  
  }

  const refundButton = () => {

  }

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
            Total must pay: {totalPrice}VND
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
      <View style={styles.section}>
        <Button
          variant="primary"
          loading={loading}
          disabled={!paymentMethod || !paymentSheetEnabled}
          title="Refund"
          onPress={refundButton}
        />
      </View>
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
