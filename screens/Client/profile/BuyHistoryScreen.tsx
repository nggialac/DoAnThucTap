import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
// import {data} from '../../../navigation/Models/MedicineData';
import Card from "./Card";
import { getMedicineByCategory } from "../../../api/MedicineApis";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { getListOrderByClient } from "../../../api/OrderApis";
import { AuthContext } from "../../../components/ContextLogin";
import { SearchBar } from "react-native-elements";
import COLORS from "../../../assets/colors/Colors";

const BuyHistoryScreen = ({ navigation, route }) => {
  const [listData, setListData] = React.useState([]);
  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const getData = (manhathuoc: string) => {
    getListOrderByClient(manhathuoc)
      .then((res) => {
        // console.log(res.data);
        setListData(res.data);
        setDataTemp(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail!", "" + e);
      });
  };

  function passData(madh: string) {
    navigation.navigate("DetailBuyHistoryScreen", { madh });
  }

  React.useEffect(() => {
    getData(nhathuoc.manhathuoc);
  }, [refreshing]);

  const renderItem = ({ item }) => {
    return (
      <Card
        key={item.madh}
        itemData={item}
        onPress={() => {
          passData(item.madh);
        }}
      />
    );
  };

  const [dataTemp, setDataTemp] = useState([]);
  const [text, setText] = useState("");

  var listTrangthai = {
    0: "Chờ xử lý",
    1: "Đã duyệt",
    2: "Đang giao",
    3: "Giao hàng thành công",
    4: "Đã hủy",
  };

  var listHTTT = {
    1: "Tiền mặt",
    2: "Online",
  };

  const searchFilterFunction = (text) => {
    setText(text);
    // console.log(dataTemp[0]);
    // text.trim()
    const newData = dataTemp.filter((item) => {
      const itemData = `${item.madh.toUpperCase()} ${item.ngaydat.toUpperCase()} ${listTrangthai[
        item.trangthai
      ].toUpperCase()} ${item.tongtien} ${listHTTT[
        item.hinhthucthanhtoan
      ].toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setListData(newData);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SearchBar
        placeholder="Type Here..."
        style={{ color: COLORS.light }}
        onChangeText={(text) => searchFilterFunction(text)}
        autoCorrect={false}
        value={text}
        autoFocus={true}
      />
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.madh}
      />
    </ScrollView>
  );
};

export default BuyHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },
});
