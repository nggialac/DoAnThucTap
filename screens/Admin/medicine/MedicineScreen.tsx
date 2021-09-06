import React, { useState } from "react";
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
  Button,
  TextInput,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  getListCategoryMedicine,
  putCategoryMedicine,
  deleteCategoryMedicine,
} from "../../../api/MedicineApis";
// import StarRating from '../components/StarRating';
import Modal from "react-native-modal";
import COLORS from "../../../assets/colors/Colors";

const MedicineScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [listData, setListData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const deleteACategory = async (madm: string) => {
    Alert.alert("Notice!", "Delete this category?", [
      { text: "Approve", onPress: () => deleteDM(madm) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const deleteDM = (madm: string) => {
    deleteCategoryMedicine(madm)
      .then((res) => {
        console.log(res);
        Alert.alert("Success", "Deleted!");
        onRefresh();
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail", "Cannot delete!");
      });
  };

  const getData = () => {
    getListCategoryMedicine()
      .then((res) => {
        console.log(res.data);
        setListData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail", "Not found Data!", [{ text: "ok" }]);
      });
  };

  const putDM = (params) => {
    putCategoryMedicine(params)
      .then((res) => {
        console.log(res);
        Alert.alert("Success", "Edited!");
        onRefresh();
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail", "Cannot Edited!");
      });
  };

  React.useEffect(() => {
    getData();
  }, [refreshing]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [madm, setMadm] = useState();
  const [textChange, setTextChange] = useState();

  const toggleModal = (item) => {
    setModalVisible(!isModalVisible);
    setMadm(item.madm);
    setTextChange(item.tendm);
    // console.log(item);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={styles.items}>
        {listData ? (
          listData.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.madm}
                style={styles.item}
                onPress={() =>
                  navigation.navigate("TabAdminHomeProductList", {
                    danhmuc: item,
                  })
                }
                onLongPress={() => {
                  deleteACategory(item.madm);
                }}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.square}>
                    <TouchableOpacity onPress={() => toggleModal(item)}>
                      <Ionicons
                        name="medical-outline"
                        color="#FF6347"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemText}>{item.tendm}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <></>
        )}
      </View>
      <View>
        <Modal isVisible={isModalVisible}>
          <View style={{ flex: 1, justifyContent:"center"}}>
            <Text style={{color: COLORS.white, fontSize: 20, textAlign:"center", marginBottom: 30, fontWeight: "bold"}}>Edit Category</Text>
            <TextInput
              style={{ color: COLORS.white }}
              value={madm}
              editable={false}
            />
            <TextInput
              style={{ color: COLORS.white, marginBottom: 20 }}
              value={textChange}
              onChangeText={(e) => setTextChange(e)}
            />
            <Button title="Change" color={"#3e2465"} onPress={() => putDM({madm: madm, tendm: textChange})} />
            <Button title="Cancel" color={"#694fad"} onPress={() => setModalVisible(!isModalVisible)} />
          </View>
        </Modal>
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
