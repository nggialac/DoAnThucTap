import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const Card = ({ itemData, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        {/* <View style={styles.cardImgWrapper}>
          <Image
            source={{uri: itemData.noidung}}
            resizeMode="cover"
            style={styles.cardImg}
          />
        </View> */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>
            Mã NT: {itemData.nhathuoc.manhathuoc}
          </Text>
          <Text style={styles.cardTitle}>
            Sản phẩm: {itemData.sanpham.tensp}
          </Text>
          <Text style={styles.cardTitle}>Thời gian: {itemData.time}</Text>
          <Text numberOfLines={2} style={styles.cardDetails}>
            Nội dung: {itemData.noidung}
          </Text>
        </View>

        
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: "row",
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardDetails: {
    marginTop: 6,
    fontSize: 12,
    color: "#444",
  },
});
