import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../assets/colors/Colors";
// import categories from "../../navigation/Models/Categories";
// import foods from "../../navigation/Models/Foods";
import {
  getMedicineByCategory,
  getListCategoryMedicine,
  getListMedicine,
} from "../../api/MedicineApis";
const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;

const HomeScreen = ({ navigation }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const getCategories = () => {
    getListCategoryMedicine()
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const getMedicines = () => {
    getListMedicine()
      .then((res) => {
        console.log(res.data);
        setMedicines(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  useEffect(() => {
    getCategories();
    getMedicines();
  }, [refreshing]);

  const ListCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.categoriesListContainer}
      >
        {categories ? categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => setSelectedCategoryIndex(index)}
          >
            <View
              style={{
                backgroundColor:
                  selectedCategoryIndex == index
                    ? COLORS.primary
                    : COLORS.secondary,
                ...style.categoryBtn,
              }}
            >
              {/* <View style={style.categoryBtnImgCon}>
                <Image
                  source={category.image}
                  style={{ height: 35, width: 35, resizeMode: "cover" }}
                />
              </View> */}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 10,
                  color:
                    selectedCategoryIndex == index
                      ? COLORS.white
                      : COLORS.primary,
                }}
              >
                {category.tendm}
              </Text>
            </View>
          </TouchableOpacity>
        )) : null}
      </ScrollView>
    );
  };
  const Card = ({ medicine }) => {
    return (
      <TouchableHighlight
        underlayColor={COLORS.white}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("DetailProductScreen", medicine)}
      >
        <View style={style.card}>
          <View style={{ alignItems: "center", top: -16 }}>
            <Image source={{uri: medicine.photo}} style={{ height: 120, width: 120 }} />
          </View>
          <View style={{ marginHorizontal: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {medicine.tensp}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.grey, marginTop: 2 }}>
              {medicine.mota_ngan}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              ${medicine.dongia}
            </Text>
            <View style={style.addToCartBtn}>
              <Icon name="add" size={20} color={COLORS.white} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View>
      <View style={style.header}>
        <View>
          <View style={{ flexDirection: "row" }}>
            {/* <Text style={{fontSize: 28}}>Medical Supplies</Text> */}
            <Text style={{ fontSize: 28, fontWeight: "bold", marginLeft: 10 }}>
              Medical Supplies
            </Text>
          </View>
          <Text style={{ marginTop: 5, fontSize: 22, color: COLORS.grey }}>
            Shopping everything!
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <Icon name="shopping-cart" size={28} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <View style={style.inputContainer}>
          <Icon name="search" size={28} />
          <TextInput
            style={{ flex: 1, fontSize: 18 }}
            placeholder="Search for product"
          />
        </View>
        <View style={style.sortBtn}>
          <Icon name="tune" size={28} color={COLORS.white} />
        </View>
      </View>

      <ListCategories />

      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={medicines}
        renderItem={({ item }) => <Card medicine={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      </View>
    // </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: COLORS.light,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 150,
    marginRight: 7,
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
