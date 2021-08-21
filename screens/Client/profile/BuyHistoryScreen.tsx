import React from "react";
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
