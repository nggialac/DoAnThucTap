import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import {
  ImageHeaderScrollView,
  TriggeringView,
} from "react-native-image-header-scroll-view";

import * as Animatable from "react-native-animatable";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const MIN_HEIGHT = Platform.OS === "ios" ? 90 : 55;
const MAX_HEIGHT = 350;

const DetailMedicineScreen = ({ route }) => {
  const itemData = route.params.itemData;
  const navTitleView = useRef(null);

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  return (
    <View style={styles.container}>
      {/* {console.log(navTitleView)} */}
      <StatusBar barStyle="light-content" />
      <ImageHeaderScrollView
        maxHeight={MAX_HEIGHT}
        minHeight={MIN_HEIGHT}
        maxOverlayOpacity={0.6}
        minOverlayOpacity={0.3}
        renderHeader={() => (
          <Image source={{ uri: itemData.photo }} style={styles.image} />
        )}
        renderForeground={() => (
          <View style={styles.titleContainer}>
            {/* <Text style={styles.imageTitle}>{itemData.mota_ngan}</Text> */}
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View style={styles.navTitleView} ref={navTitleView}>
            <Text style={styles.navTitle}>{itemData.mota_ngan}</Text>
          </Animatable.View>
        )}
      >
        <TriggeringView
          style={styles.section}
          onHide={() => navTitleView.current.fadeInUp(200)}
          onDisplay={() => navTitleView.current.fadeOut(100)}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.mota_ngan}>Mã thuốc: {itemData.masp}</Text>

            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              {/* <FontAwesome name="star" size={16} color="#FF6347" /> */}
              {/* <Text style={{ marginHorizontal: 2 }}>{itemData.rating}</Text>
              <Text>({itemData.reviews})</Text> */}
            </View>
          </View>
        </TriggeringView>
        <View style={[styles.section, styles.sectionLarge]}>
          <Text style={styles.mota_ngan}>{itemData.tensp} - {itemData.mota_ngan}</Text>
          {/* <Text style={styles.sectionContent}></Text> */}
          
          <Text style={styles.sectionContent}>Số lượng tồn: {itemData.soluong}</Text>
          <Text style={styles.sectionContent}>Giá bán: {currencyFormat(itemData.dongia)}</Text>
          <Text style={styles.sectionContent}>Danh mục: {itemData.danhmuc.tendm}</Text>
          <Text style={styles.mota_chitiet}>{itemData.mota_chitiet}</Text>

        </View>

        {/* <View style={styles.section}>
          <View style={styles.categories}>
            {itemData.categories.map((category, index) => (
              <View style={styles.categoryContainer} key={index}>
                <FontAwesome name="tag" size={16} color="#fff" />
                <Text style={styles.category}>{category}</Text>
              </View>
            ))}
          </View>
        </View> */}

        {/* <View style={[styles.section, { height: 250 }]}></View> */}
      </ImageHeaderScrollView>
    </View>
  );
};

export default DetailMedicineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: MAX_HEIGHT,
    width: Dimensions.get("window").width,
    alignSelf: "stretch",
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
  },
  name: {
    fontWeight: "bold",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionContent: {
    fontSize: 16,
    fontWeight:"600",
    textAlign: "justify",
  },
  mota_chitiet:{
    fontSize: 16,
    textAlign: "justify",
  },
  categories: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  categoryContainer: {
    flexDirection: "row",
    backgroundColor: "#FF6347",
    borderRadius: 20,
    margin: 10,
    padding: 10,
    paddingHorizontal: 15,
  },
  category: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
  },
  titleContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  imageTitle: {
    color: "white",
    backgroundColor: "transparent",
    fontSize: 24,
  },
  navTitleView: {
    height: MIN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 5,
    opacity: 0,
  },
  navTitle: {
    color: "white",
    fontSize: 18,
    backgroundColor: "transparent",
  },
  sectionLarge: {
    minHeight: 300,
  },
  mota_ngan: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
