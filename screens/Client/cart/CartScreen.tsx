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
  ScrollView,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../../assets/colors/Colors";
import foods from "../../../navigation/Models/Foods";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../components/PrimaryButton";
import {
  deleteCartByMedicineId,
  getListCart,
  putNumberOfProduct,
} from "../../../api/CartApis";
import { AuthContext } from "../../../components/ContextLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NumberFormat from "react-number-format";

const CartScreen = ({ navigation }) => {
  // const [tk, setTk] = React.useState();
  const [listData, setListData] = React.useState([]);
  const [dataCart, setDataCart] = React.useState([]);
  const [limit, setLimit] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [count, setCount] = React.useState(1);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
    setLimit(false);
  }, []);
  // console.log(nhathuoc);

  // const getData = async () => {
  //   try {
  //     const res = await AsyncStorage.getItem("MNV_MNT");
  //     if (res !== null) {
  //       console.log(tk);
  //       setTk(JSON.parse(res));
  //     }
  //   } catch (e) {
  //     Alert.alert("Invalid User!", "" + e, [{ text: "Okay" }]);
  //   }
  // };

  const getCart = (manhathuoc: string) => {
    getListCart(manhathuoc)
      .then((res) => {
        // Alert.alert("Success!", "" + res, [{ text: "ok" }]);
        console.log(res.data);
        setListData(res.data);
        setDataCart(res.data);
        setTotal(totalPrice(res.data));
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const changeNumberOfProduct = async (
    manhathuoc: string,
    masp: string,
    soluong: number
  ) => {
    let check: boolean = false;

    await putNumberOfProduct(manhathuoc, masp, soluong)
      .then((res) => {
        console.log(res.data);
        check = true;
        setIsLoading(false);
        // onRefresh();
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Failed", "This product not enough quantity!", [
          { text: "ok" },
        ]);
        // setLimit(true);
        check = false;
        setIsLoading(false);
        // onRefresh();
      });
    // onRefresh();
    return check;
  };

  const deleteProductFromCart = async (manhathuoc: string, masp: string) => {
    var check = false;
    Alert.alert("Notice", "Really want to delete this product from cart?", [
      {
        text: "Yes",
        onPress: async () => {
          await deleteCartByMedicineId(manhathuoc, masp)
            .then((res) => {
              console.log(res.data);
              check = true;
            })
            .catch((e) => {
              console.log(e);
              Alert.alert("Fail", "Cannot Delete this product from cart!" + e, [
                { text: "ok" },
              ]);
              check = false;
            });
          onRefresh();
        },
      },
      {
        text: "Cancel",
        onPress: () => {},
      },
    ]);

    return check;
  };

  React.useEffect(() => {
    // console.log(JSON.parse(nhathuoc).manhathuoc);
    getCart(nhathuoc.manhathuoc);
  }, [refreshing]);

  const onChangeQual = async (i, type) => {
    const dataCar = dataCart;
    let cantd = dataCar[i].soluong;
    let check: boolean = false;
    setIsLoading(true);
    if (type) {
      cantd = cantd + 1;
      dataCar[i].soluong = cantd;
      check = await changeNumberOfProduct(
        nhathuoc.manhathuoc,
        dataCar[i].id.masp,
        cantd
      );

      if (check === true) {
        setDataCart([...dataCar]);
        setTotal(totalPrice(dataCart));
        setLimit(false);
      } else {
        setLimit(true);
        onRefresh();
      }
    } else if (type == false && cantd >= 2) {
      cantd = cantd - 1;
      dataCar[i].soluong = cantd;
      setLimit(false);
      await changeNumberOfProduct(
        nhathuoc.manhathuoc,
        dataCar[i].id.masp,
        cantd
      );
      setDataCart([...dataCar]);
      setTotal(totalPrice(dataCart));
    } else if (type == false && cantd == 1) {
      setLimit(false);
      let isDelete = await deleteProductFromCart(
        nhathuoc.manhathuoc,
        dataCar[i].id.masp
      );
      console.log(isDelete);
      if (isDelete) {
        dataCar.splice(i, 1);
        setDataCart([...dataCar]);
        setTotal(totalPrice(dataCart));
      }
    }
    onRefresh();
  };

  const changeCount = async (i, count) => {
    console.log(typeof count, count);
    // count = parseInt(count);
    if (count <= 0 || count > 10000) {
      Alert.alert("Notice", "Invalid input!");
      return;
    }

    const dataCar = dataCart;
    let cantd = dataCar[i].soluong;
    let check: boolean = false;
    setIsLoading(true);

    cantd = count;
    dataCar[i].soluong = cantd;
    check = await changeNumberOfProduct(
      nhathuoc.manhathuoc,
      dataCar[i].id.masp,
      cantd
    );

    if (check === true) {
      setDataCart([...dataCar]);
      setTotal(totalPrice(dataCart));
      setLimit(false);
    } else {
      setLimit(true);
      onRefresh();
    }
  };

  function totalPrice(arr) {
    return arr.reduce((sum, i) => {
      return sum + i.sanpham.dongia * i.soluong;
    }, 0);
  }

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  const CartCard = ({ item, index }) => {
    return (
      <View style={style.cartCard}>
        <Image source={{ uri: item.sanpham.photo }} style={style.image} />
        <View
          style={{
            height: 100,
            marginLeft: 10,
            paddingVertical: 20,
            flex: 1,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {item.sanpham.tensp}
          </Text>
          {/* <Text style={{ fontSize: 13, color: COLORS.grey }}>
            {item.sanpham.mota_ngan}
          </Text> */}
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            {currencyFormat(item.sanpham.dongia)}
          </Text>
        </View>
        <View style={{ marginRight: 20, alignItems: "center" }}>
          {/* <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {item.soluong}
          </Text> */}
          {/* {console.log(count)} */}
          <TextInput
            style={{
              fontSize: 18,
              // marginHorizontal: 10,
              fontWeight: "bold",
            }}
            keyboardType="number-pad"
            defaultValue={item.soluong.toString()}
            // value={count}
            // onChange={(val) => setCount(val)}
            onEndEditing={
              (val) => changeCount(index, parseInt(val.nativeEvent.text))
              // console.log(val.nativeEvent.text)
            }
          />

          {isLoading === true ? (
            // <ActivityIndicator size="small" color="#0000ff" />
            <View style={style.disableBtn}>
              <Icon name="remove" size={25} color={COLORS.white} />
              <Icon name="add" size={25} color={COLORS.white} />
            </View>
          ) : (
            <View style={style.actionBtn}>
              <TouchableOpacity onPress={() => onChangeQual(index, false)}>
                <Icon name="remove" size={25} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  limit === false
                    ? onChangeQual(index, true)
                    : Alert.alert("Notice", "Not enough quantity!")
                }
              >
                <Icon name="add" size={25} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{ marginRight: 0, marginBottom: 70 }}>
          <TouchableOpacity
            onPress={() => {
              deleteProductFromCart(nhathuoc.manhathuoc, item.sanpham.masp);
            }}
          >
            {/* <Text>X</Text> */}
            <Icon name="delete-sweep" size={18} color={COLORS.dark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white, flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cart</Text>
      </View>
      {typeof listData !== "undefined" && listData.length > 0 ? (
        <View>
          <FlatList
            keyExtractor={(item) => "key" + item.id.masp}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            data={listData}
            renderItem={({ item, index }) => (
              <CartCard item={item} index={index} />
            )}
            ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
            // ListFooterComponent={() => (

            // )}
          />
          <View style={{marginHorizontal: 16, marginBottom: 20}}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
            >
              Billing Information
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // marginVertical: 15,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Order value:
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {currencyFormat(total)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // marginVertical: 15,
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total:</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {currencyFormat(total)}
              </Text>
            </View>

            <View style={{ marginHorizontal: 30 }}>
              <PrimaryButton
                title="CHECKOUT"
                onPress={() => {
                  // total && dataCart ? navigation.navigate("CheckOutScreen", { total, dataCart }) : Alert.alert("Fail!", "Cannot checkout without item!");
                  total && dataCart
                    ? navigation.navigate("CheckOutMethodScreen", {
                        total,
                        dataCart,
                      })
                    : Alert.alert("Fail!", "Cannot checkout without item!");
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>

          <Image
            source={{
              uri: "https://www.seekpng.com/png/detail/117-1170538_404-your-cart-is-empty.png",
            }}
            style={{
              marginTop: 16,
              height: 200,
              width: 500,
              alignSelf: "auto",
              resizeMode: "contain",
            }}
          />
          <View style={{ marginHorizontal: 30 }}>
            <SecondaryButton
              title="BUY SOMETHING !!!"
              onPress={() => {
                // total && dataCart ? navigation.navigate("CheckOutScreen", { total, dataCart }) : Alert.alert("Fail!", "Cannot checkout without item!");
                navigation.goBack();
              }}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};
const style = StyleSheet.create({
  section: {
    marginTop: 90,
  },
  header: {
    marginTop: 30,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  cartCard: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  disableBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  image: {
    marginTop: 16,
    height: 70,
    width: 60,
    alignSelf: "stretch",
    resizeMode: "cover",
    marginBottom: 8,
  },
});

export default CartScreen;
