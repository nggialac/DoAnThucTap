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
import { SearchBar } from "react-native-elements";

const MedicineListScreen = ({ navigation, route }) => {
  const madm = route.params.danhmuc.madm;
  const [listData, setListData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    getMedicineByCategory(madm)
      .then((res) => {
        // console.log(res.data);
        setListData(res.data);
        setDataTemp(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "Not found Data", [{ text: "ok" }]);
      });
  }, [refreshing]);

  const renderItem = ({ item }) => {
    return (
      <Card
        key={item.masp}
        itemData={item}
        onPress={() =>
          navigation.navigate("TabAdminHomeProductDetail", { itemData: item })
        }
      />
    );
  };

  const [dataTemp, setDataTemp] = useState([]);
  const [text, setText] = useState("");

  const searchFilterFunction = (text) => {
    setText(text);
    // console.log(dataTemp[0]);
    const newData = dataTemp.filter((item) => {
      const itemData = `${item.tensp.toUpperCase()} ${item.masp.toUpperCase()} ${item.mota_ngan.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setListData(newData);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={(text) => searchFilterFunction(text)}
        autoCorrect={false}
        value={text}
        autoFocus={true}
      />
      <View style={styles.container}>
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.masp}
        />
      </View>
    </ScrollView>
  );
};

export default MedicineListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },
});
