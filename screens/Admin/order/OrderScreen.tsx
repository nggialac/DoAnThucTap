import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  StatusBar,
  Animated,
  RefreshControl,
  Alert,
  LogBox,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Orders from "../../../navigation/Models/ListOrder";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  cancelOrder,
  deleteOrderById,
  getListOrder,
  putOrder,
} from "../../../api/OrderApis";
import { API_URL } from "../../Client/cart/Config";
import { SearchBar } from "react-native-elements";
import { AuthContext } from "../../../components/ContextLogin";
// import Animated from "react-native-reanimated";

function OrderScreen({ navigation }) {
  LogBox.ignoreAllLogs();

  const context = React.useContext(AuthContext);
  const nhanvien = context.loginState.mnv_mnt;

  var listTrangthai = {
    0: "Chờ xử lý",
    1: "Đã duyệt",
    2: "Đang giao",
    3: "Giao hàng thành công",
    4: "Đã hủy",
  };

  const [orders, setOrders] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  React.useEffect(() => {
    listOrder();
  }, [refreshing]);

  const listOrder = async () => {
    await getListOrder()
      .then((res) => {
        // console.log(res.data);
        // Alert.alert("Success!", "Success!", [{ text: "ok" }]);
        // setListData(res.data);
        // res.data.map((obj, index)=> ({ ...obj, key: index}));
        const newArr = res.data.map((v, index) => ({ ...v, key: index }));
        console.log(res.data);
        setOrders(newArr);
        setDataTemp(newArr);
        // setListData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  // const deleteOrderID = (id) => {
  //   deleteOrderById(id)
  //     .then((res) => {
  //       // Alert.alert("Success!", "Success!", [{ text: "ok" }]);
  //       console.log(res);
  //     })
  //     .catch((e) => {
  //       // Alert.alert("Fail!", '', [{ text: "ok" }]);
  //       console.log(e);
  //     });
  // };

  //
  // const closeRow = (rowMap, rowKey) => {
  //   if (rowMap[rowKey]) {
  //     rowMap[rowKey].closeRow();
  //   }
  // };

  const editRow = async (rowMap, rowKey, order) => {
    // cancelOrderByMadh(
    //   order.madh,
    //   order.hinhthucthanhtoan,
    //   order.paymentcreated
    // );

    cancelOrderByNv(order.hinhthucthanhtoan, order.paymentcreated, order);
  };

  const detailOrder = (madh) => {
    navigation.navigate("DetailBuyHistoryScreen", { madh });
  };

  // const deleteRow = async (rowMap, rowKey, madh, trangthai) => {
  //   if (trangthai === 4) {
  //     Alert.alert("Notice!", "Are you want delete this order?", [
  //       {
  //         text: "Approve",
  //         onPress: async () => {
  //           closeRow(rowMap, rowKey);
  //           await deleteOrderID(madh);
  //           const newData = [...orders];
  //           const prevIndex = orders.findIndex((item) => item.key === rowKey);
  //           newData.splice(prevIndex, 1);
  //           setOrders(newData);
  //         },
  //       },
  //       {
  //         text: "Cancel",
  //       },
  //     ]);
  //   } else {
  //     Alert.alert("Notice!", "Delete only with order be canceled!");
  //   }
  // };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const onLeftActionStatusChange = (rowKey) => {
    console.log("onLeftActionStatusChange", rowKey);
  };

  const onRightActionStatusChange = (rowKey) => {
    console.log("onRightActionStatusChange", rowKey);
  };

  const onRightAction = (rowKey) => {
    console.log("onRightAction", rowKey);
  };

  const onLeftAction = (rowKey) => {
    console.log("onLeftAction", rowKey);
  };

  const doRefund = async (pi: string) => {
    try {
      await fetch(`${API_URL}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pi,
        }),
      });
      Alert.alert("Success", "Refund Complete!");
    } catch (e) {
      Alert.alert("Failed", "Refund has problem! "+ e);
    }
  };

  const cancelOrderByNv = async (
    hinhthucthanhtoan: number,
    pi: string,
    params: any
  ) => {
    Alert.alert("Notice!", "Are you want cancel this order?", [
      {
        text: "Approve",
        onPress: async () => {
          params["trangthai"] = 4;
          // console.log(params["trangthai"]);
          params["nhanvien"] = nhanvien;
          await putOrder(params)
            .then(async (res) => {
              console.log(res.data);
              hinhthucthanhtoan === 2 ? await doRefund(pi) : null;
              Alert.alert("Success!", "Order was canceled!");
              
            })
            .catch((e) => {
              console.log(e);
              Alert.alert("Failed!", "Cannot cancel");
            });
            onRefresh();
        },
      },
      {
        text: "Cancel",
      },
    ]);

  };

  const cancelOrderByMadh = (
    madh: string,
    hinhthucthanhtoan: number,
    pi: string
  ) => {
    Alert.alert("Notice!", "Are you want cancel this order?", [
      {
        text: "Approve",
        onPress: () =>
          cancelOrder(madh)
            .then(async (res) => {
              console.log(res.data);
              hinhthucthanhtoan === 2 ? await doRefund(pi) : null;
              Alert.alert("Success!", "Order was canceled!");
            })
            .catch((e) => {
              console.log(e);
              Alert.alert("Failed!", "Cannot cancel");
            }),
      },
      {
        text: "Cancel",
      },
    ]);
  };

  const updateOrder = (madh: string, params: any) => {
    // console.log("check params update", params);
    if (params.trangthai === 4) {
      Alert.alert("Notice", "Order was canceled!", [
        {
          text: "Ok!",
        },
      ]);
    } else if (params.trangthai === 3) {
      Alert.alert("Notice", "Order was delivered successfully!", [
        {
          text: "Ok!",
        },
      ]);
    } else {
      Alert.alert(
        "Notice!",
        `Changing status from "${listTrangthai[params.trangthai]}" to "${
          listTrangthai[params.trangthai + 1]
        }"?`,
        [
          {
            text: "Approve",
            onPress: () =>
              params["trangthai"] < 3
                ? getUpdate(madh, params)
                : // : cancelOrderByMadh(
                  //     madh,
                  //     params.hinhthucthanhtoan,
                  //     params.paymentcreated
                  //   ),
                  Alert.alert("Notice", "Order was delivered successfully!"),
          },
          {
            text: "Cancel",
          },
        ]
      );
    }
  };

  const getUpdate = async (madh: string, params: any) => {
    let changed;
    // console.log(params.trangthai);
    // params["trangthai"] >= 3
    //   ? (changed = 3)
    //   : (changed = params["trangthai"] + 1);
    // console.log(changed);
    if (params["trangthai"] >= 3) {
      Alert.alert("Failed", "This order was delivered successfully!");
    } else {
      // params["nhanvien"] = nhanvien;
      changed = params["trangthai"] + 1;
      params["trangthai"] = changed;
      // console.log(params["trangthai"]);
      params["nhanvien"] = nhanvien;
      await putOrder(params)
        .then((res) => {
          console.log(res.data);
          Alert.alert("Success!", "Order was updated!");
          
        })
        .catch((e) => {
          console.log(e);
          Alert.alert("Failed!", "Cannot update!");
        });
        onRefresh();
    }
  };

  // function getValue(key: number) {
  //   return listTrangthai[key];
  // }

  const VisibleItem = (props) => {
    const {
      data,
      rowHeightAnimatedValue,
      removeRow,
      leftActionState,
      rightActionState,
    } = props;

    if (rightActionState) {
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <Animated.View
        style={[styles.rowFront, { height: rowHeightAnimatedValue }]}
      >
        {/* {console.log(data.item)} */}
        <TouchableHighlight
          style={styles.rowFrontVisible}
          onLongPress={() => updateOrder(data.item.madh, data.item)}
          underlayColor={"#aaa"}
        >
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {data.item.madh} - Trạng thái:{" "}
              {listTrangthai[data.item.trangthai]}
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              Ngày đặt: {data.item.ngaydat.slice(0, 10)}; Đặt bởi:{" "}
              {data.item.nhathuoc.tennhathuoc}
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              Giá trị đơn hàng: {currencyFormat(data.item.tongtien)}
            </Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  };

  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() =>
          // deleteRow(rowMap, data.item.key)
          // deleteRow(rowMap, data.item.key, data.item.madh, data.item.trangthai)
          detailOrder(data.item.madh)
        }
      />
    );
  };

  const HiddenItemWithActions = (props) => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false,
      }).start();
    }

    return (
      <Animated.View
        style={[styles.rowBack, { height: rowHeightAnimatedValue }]}
      >
        <Text>Left</Text>
        {!leftActionActivated && (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={onClose}
          >
            <MaterialCommunityIcons
              name="file-edit-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={onDelete}
            >
              <Animated.View
                style={[
                  styles.trash,
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-90, -45],
                          outputRange: [1, 0],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons name="details" size={25} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() =>
          // closeRow(rowMap, data.item.key)
          data.item.trangthai !== 3 && data.item.trangthai !== 4
            ? editRow(rowMap, data.item.key, data.item)
            : Alert.alert(
                "Notice",
                "Can't cancel order with status 'Đã giao' or 'Đã hủy'!"
              )
        }
        onDelete={() =>
          // deleteRow(rowMap, data.item.key)
          // deleteRow(rowMap, data.item.key, data.item.madh, data.item.trangthai)
          detailOrder(data.item.madh)
        }
      />
    );
  };

  const [dataTemp, setDataTemp] = useState([]);
  const [text, setText] = useState("");

  const searchFilterFunction = (text) => {
    setText(text);

    const newData = dataTemp.filter((item) => {
      const itemData = `${item.madh.toUpperCase()} ${item.nhathuoc.tennhathuoc.toUpperCase()} ${listTrangthai[
        item.trangthai
      ].toUpperCase()} ${item.ngaydat.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setOrders(newData);
  };

  // const renderHeader = () => {
  //   return (

  //   );
  // };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <StatusBar backgroundColor="#FF6347" barStyle="light-content"/> */}

      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={(text) => searchFilterFunction(text)}
        autoCorrect={false}
        value={text}
        autoFocus={true}
      />

      <SwipeListView
        data={orders}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        disableRightSwipe
        onRowDidOpen={onRowDidOpen}
        leftActivationValue={100}
        // rightActivationValue={-150}
        leftActionValue={0}
        rightActionValue={-500}
        onLeftAction={onLeftAction}
        onRightAction={onRightAction}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(e) => "key" + e.madh}
        // ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 100,
    margin: 5,
    marginBottom: 15,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 100,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: "flex-end",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: "red",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "green",
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
  },
  details: {
    fontSize: 12,
    color: "#999",
  },
});
