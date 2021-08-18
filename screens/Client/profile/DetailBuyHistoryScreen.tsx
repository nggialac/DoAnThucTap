import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../../assets/colors/Colors";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { AuthContext } from "../../../components/ContextLogin";
import { getListOrderByMaDH } from "../../../api/OrderApis";


const DetailBuyHistoryScreen = ({ navigation, route }) => {
  // const [tk, setTk] = React.useState();
  const [listData, setListData] = React.useState([]);
  const context = React.useContext(AuthContext);
  const nhathuoc = JSON.parse(context.loginState.mnv_mnt);
  const madh = route.params.madh;
  // console.log(madh);

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

  React.useEffect(() => {
    // console.log(JSON.parse(nhathuoc).manhathuoc);
    getData(madh);
  }, []);

  const CartCard = ({ item, index }) => {
    return (
      <View style={style.cartCard}>
        <Image source={{ uri: item.sanpham.photo }} />
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
          <Text style={{ fontSize: 13, color: COLORS.grey }}>
            {item.sanpham.mota_ngan}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            ${item.sanpham.dongia}
          </Text>
        </View>
        <View style={{ marginRight: 20, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Số lượng: {item.soluong}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={style.header}>
        {/* <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} /> */}
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
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 15,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Total Price: {listData.tongtien}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
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
});

export default DetailBuyHistoryScreen;
