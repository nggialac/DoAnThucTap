import React from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
// import {data} from '../../../navigation/Models/MedicineData';
import Card from "./Card";
import { getMedicineByCategory } from "../../../api/MedicineApis";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { getListOrderByClient } from "../../../api/OrderApis";
import { AuthContext } from "../../../components/ContextLogin";

const BuyHistoryScreen = ({ navigation, route }) => {
  const [listData, setListData] = React.useState([]);
  const context = React.useContext(AuthContext);
  const nhathuoc = JSON.parse(context.loginState.mnv_mnt);

  const getData = (manhathuoc: string) => {
    getListOrderByClient(manhathuoc)
      .then((res) => {
        console.log(res.data);
        setListData(res.data);
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
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Card
        key={item.madh}
        itemData={item}
        onPress={() => {
          passData(item.madh)
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.madh}
      />
    </View>
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
