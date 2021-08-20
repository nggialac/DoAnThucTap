import React from "react";
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
  LogBox
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
// import Animated from "react-native-reanimated";

function OrderScreen({ navigation }) {

  LogBox.ignoreAllLogs();

  var listTrangthai = {
    0: "Chờ xử lý",
    1: "Đã duyệt",
    2: "Đang giao",
    3: "Giao hàng thành công",
    4: "Đã hủy"
  }

  const [orders, setOrders] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

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
        // setListData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const deleteOrderID = (id) => {
    deleteOrderById(id)
      .then((res) => {
        // Alert.alert("Success!", "Success!", [{ text: "ok" }]);
        console.log(res);
      })
      .catch((e) => {
        // Alert.alert("Fail!", '', [{ text: "ok" }]);
        console.log(e);
      });
  };

  //
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const editRow = async (rowMap, rowKey, order) => {
    cancelOrderByMadh(order.madh);
  };

  const deleteRow = async (rowMap, rowKey, madh) => {
    Alert.alert("Notice!", "Are you want update status for this order?", [
      {
        text: "Approve",
        onPress: async() => {
          closeRow(rowMap, rowKey);
          await deleteOrderID(madh);
          const newData = [...orders];
          const prevIndex = orders.findIndex((item) => item.key === rowKey);
          newData.splice(prevIndex, 1);
          setOrders(newData);
        },
      },
      {
        text: "Cancel",
      },
    ]);

  };

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

  const cancelOrderByMadh = (madh: string) => {
    Alert.alert("Notice!", "Are you want cancel this order?", [
      {
        text: "Approve",
        onPress: () =>
          cancelOrder(madh)
            .then((res) => {
              console.log(res.data);
              Alert.alert("Success!", "Order was canceled");
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
    Alert.alert("Notice!", "Are you want update status for this order?", [
      {
        text: "Approve",
        onPress: () => getUpdate(madh, params),
      },
      {
        text: "Cancel",
      },
    ]);
  };

  const getUpdate = async (madh: string, params: any) => {
    let changed;
    // console.log(params.trangthai);
    params["trangthai"] > 2 
      ? (changed = 1)
      : (changed = params["trangthai"] + 1);
    // console.log(changed);
    params["trangthai"] = changed;
    console.log(params["trangthai"]);
    await putOrder(params)
      .then((res) => {
        console.log(res.data);
        Alert.alert("Success!", "Order was updated");
        onRefresh();
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Failed!", "Cannot update");
      });
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
          onPress={() => updateOrder(data.item.madh, data.item)}
          underlayColor={"#aaa"}
        >
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {data.item.madh} - Trạng thái: {listTrangthai[data.item.trangthai]}
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              Ngày đặt: {data.item.ngaydat.slice(0, 10)}, Tổng tiền:{" "}
              {data.item.tongtien}đ
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              Client: {data.item.nhathuoc.tennhathuoc}
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
          deleteRow(rowMap, data.item.key, data.item.madh)
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
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={25}
                  color="#fff"
                />
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
          editRow(rowMap, data.item.key, data.item)
        }
        onDelete={() =>
          // deleteRow(rowMap, data.item.key)
          deleteRow(rowMap, data.item.key, data.item.madh)
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <StatusBar backgroundColor="#FF6347" barStyle="light-content"/> */}
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
    backgroundColor: "#1f65ff",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
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
