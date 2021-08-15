import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getListCategoryMedicine, putCategoryMedicine, deleteCategoryMedicine } from "../../../api/MedicineApis";
// import StarRating from '../components/StarRating';

const MedicineScreen = ({ navigation }) => {
  const theme = useTheme();
  const [listData, setListData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    getListCategoryMedicine()
      .then((res) => {
        console.log(res.data);
        setListData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "Not found Data", [{ text: "ok" }]);
      });
  }, [refreshing]);

  // const handleEdit = (params) => {
  //   // const reqData = {params.}
  //   putCategoryMedicine(params)
  //   .then(res=>{
  //     Alert.alert("Fail!", "Success!", [{ text: "ok" }]);
  //   })
  //   .catch(e=> {
  //     Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
  //   })
  // }

  return (
    <ScrollView 
    style={styles.container} 
    refreshControl={<RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={styles.items}>
        {listData ? (
          listData.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.madm}
                style={styles.item}
                onPress={() => navigation.navigate("TabAdminHomeProductList", {danhmuc: item})}
                onLongPress={()=>{}}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.square}>
                    <Ionicons
                      name="medical-outline"
                      color="#FF6347"
                      size={30}
                    />
                  </View>
                  <Text style={styles.itemText}>{item.tendm}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <></>
        )}

        {/* <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() =>
            navigation.navigate("TabAdminHomeProductList", { title: "Fastfood Center" })
          }
        >
          <View style={styles.categoryIcon}>
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={35}
              color="#FF6347"
            />
          </View>
          <Text style={styles.categoryBtnTxt}>Fastfood Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
          <View style={styles.categoryIcon}>
            <MaterialCommunityIcons name="food" size={35} color="#FF6347" />
          </View>
          <Text style={styles.categoryBtnTxt}>Snacks Corner</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

export default MedicineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  items: {
    marginTop: 30,
  },
  item: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 36,
    height: 36,
    // backgroundColor: "#55BCF6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "80%",
  },
});
