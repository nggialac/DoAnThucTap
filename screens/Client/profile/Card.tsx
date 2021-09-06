import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const Card = ({ itemData, onPress }) => {
  var listTrangthai = {
    0: "Chờ xử lý",
    1: "Đã duyệt",
    2: "Đang giao",
    3: "Giao hàng thành công",
    4: "Đã hủy",
  };

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        {/* <View style={styles.cardImgWrapper}>
          <Image
            source={{uri: itemData.listCTDH}}
            resizeMode="cover"
            style={styles.cardImg}
          />
        </View> */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Mã đơn: {itemData.madh}</Text>
          <Text style={styles.cardTitle}>
            Ngày đặt: {itemData.ngaydat.slice(0, 10)}
          </Text>

          <Text numberOfLines={1} style={styles.cardDetails}>
            HTTT:
            {itemData.hinhthucthanhtoan !== 1 ? (
              <Text> Online</Text>
            ) : (
              <Text> Tiền mặt</Text>
            )}
          </Text>
          <Text numberOfLines={1} style={styles.cardDetails}>
            Tình trạng: 
            {listTrangthai[itemData.trangthai]}
          </Text>
          <Text numberOfLines={1} style={styles.cardDetails}>
            <Text>Tổng tiền: {currencyFormat(itemData.tongtien)}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    height: 110,
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
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardDetails: {
    // marginTop: 10,
    fontSize: 12,
    color: "#444",
  },
});
