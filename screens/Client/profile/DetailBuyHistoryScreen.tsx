import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../../assets/colors/Colors";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { AuthContext } from "../../../components/ContextLogin";
import { cancelOrder, getListOrderByMaDH } from "../../../api/OrderApis";
import Button from "../cart/Button";
import { Dimensions } from "react-native";
import { API_URL } from "../cart/Config";
import axios from "axios";

const DetailBuyHistoryScreen = ({ navigation, route }) => {
  // const [tk, setTk] = React.useState();
  const [listData, setListData] = React.useState([]);
  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  const madh = route.params.madh;
  // console.log(madh);

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  var listTrangthai = {
    0: "Chờ xử lý",
    1: "Đã duyệt",
    2: "Đang giao",
    3: "Giao hàng thành công",
    4: "Đã hủy",
  };

  const getData = (madh: string) => {
    getListOrderByMaDH(madh)
      .then((res) => {
        console.log(res.data);
        setListData(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const doRefund = async (pi: string) => {
    try {
      const response = await fetch(`${API_URL}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pi: pi,
        }),
      });
      Alert.alert("Success", "Refund Complete !");
    } catch (e) {
      console.log(e)
    }

    // console.log(response);

    // return await response.json();
  }

  //   const doRefund = async (pi: string) => {
  //     console.log(pi);
  //     try{
  //   //   const response = await fetch(`${API_URL}/refund`, {
  //   //     method: "POST",
  //   //     headers: {
  //   //       Accept: 'application/json',
  //   //   'Content-Type': 'application/json'
  //   //     },
  //   //     body: JSON.stringify({
  //   //       // created: created,
  //   //       pi
  //   //       // request_three_d_secure: 'any',
  //   //     }),
  //   //   });
  //   //   // const { status } = await response.json();
  //   // }
  //   axios({
  //   method: 'post',
  //   url: `${API_URL}/refund`,
  //   headers: {}, 
  //   data: {
  //     pi: pi, // This is the body part
  //   }
  // });}
  //   catch(e){
  //     Alert.alert("Fail", ""+ e);
  //   }
  
  //   Alert.alert("Success", "Refund Complete !");
      
  
  //     // return {
  //     //   status,
  //     // };
  //   };
  // };

  React.useEffect(() => {
    // console.log(JSON.parse(nhathuoc).manhathuoc);
    getData(madh);
  }, []);

  const CartCard = ({ item, index }) => {
    return (
      <View>
        <View style={style.cartCard}>
          {/* {console.log(item.sanpham.photo)} */}
          <View
            style={{
              height: 120,
              marginLeft: 10,
              paddingVertical: 20,
              flex: 1,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.sanpham.masp} - {item.sanpham.tensp}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.grey }}>
              {item.sanpham.danhmuc.tendm}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.grey }}>
              Đơn giá: {currencyFormat(item.sanpham.dongia)}
              {/* console.log(item.sanpham); */}
            </Text>
          </View>
          <View style={{ marginRight: 10 }}>
            <Image style={style.image} source={{ uri: item.sanpham.photo }} />
            <Text style={{ fontWeight: "300", fontSize: 16 }}>
              Số lượng: {item.soluong}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const cancelOrderByMadh = async (madh: string) => {
    // console.log(listData);
    await Alert.alert("Notice!", "Are you want cancel this order?", [
      {
        text: "Approve",
        onPress: async () =>
          await cancelOrder(madh, "")
            .then(async(res) => {
              // console.log(res.data);
              // console.log(listData.paymentcreated);
              listData.hinhthucthanhtoan !== 1
                ? await doRefund(listData.paymentcreated)
                : null;

              Alert.alert("Success", "Canceled!");
            })
            .catch((e) => {
              console.log(e);
              Alert.alert("Failed", "Cannot cancel!");
            }),
      },
      {
        text: "Cancel",
      },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View
        style={[
          style.header,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        {/* <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} /> */}
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>MÃ ĐƠN: {madh}</Text>
      </View>
      <View
        style={[
          style.header,
          { alignItems: "center", justifyContent: "center", marginTop: 0 },
        ]}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>TRẠNG THÁI: </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {listTrangthai[listData.trangthai]}
        </Text>
      </View>
      <FlatList
        keyExtractor={(item) => item.id.masp}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={listData.listCTDH}
        renderItem={({ item, index }) => <CartCard item={item} index={index} />}
        ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
        ListFooterComponent={() => (
          <View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-evenly",
                marginVertical: 15,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                Tổng giá trị: {listData.tongtien ? currencyFormat(parseFloat(listData.tongtien)) : null}
                {/* console.log(listData.tongtien); */}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Hình Thức Thanh Toán:{" "}
                {listData.hinhthucthanhtoan === 2 ? "Online" : "Tiền mặt"}
              </Text>
            </View>
            {listData.trangthai === 0 ||
            listData.trangthai === 1 ||
            (listData.trangthai === 2 &&
              nhathuoc.taikhoan.quyen.maquyen !== 2) ? (
              <View style={{ marginHorizontal: 20 }}>
                <Button
                  variant="primary"
                  loading={false}
                  title="CANCEL ORDER"
                  onPress={() => {
                    cancelOrderByMadh(listData.madh);
                  }}
                />
              </View>
            ) : null}
          </View>
        )}
      />
    </ScrollView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    paddingVertical: 20,
    flexDirection: "row",
    // alignItems: "center",
    marginHorizontal: 20,
  },
  image: {
    height: 50,
    width: 80,
    alignSelf: "stretch",
    resizeMode: "cover",
    marginBottom: 8,
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
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    // alignContent: "center",
  },
});

export default DetailBuyHistoryScreen;
