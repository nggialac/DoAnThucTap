import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TouchableHighlight,
  StatusBar,
  Animated,
  Alert,
  RefreshControl,
  ScrollView,
  SafeAreaView
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
// import Orders from "../../../navigation/Models/ListOrder";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getListStaff, deleteStaff } from "../../../api/StaffApi";
// import Animated from "react-native-reanimated";

function StaffScreen({ navigation }) {
  const [staff, setStaff] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const listStaff = async () => {
    await getListStaff()
      .then((res) => {
        // console.log(res.data);
        // Alert.alert("Success!", "Success!", [{ text: "ok" }]);
        // setListData(res.data);
        // res.data.map((obj, index)=> ({ ...obj, key: index}));
        const newArr = res.data.map((v, index) => ({ ...v, key: index }));
        setStaff(newArr);
        // setListData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const deleteStaffByID = (id) => {
    deleteStaff(id)
      .then((res) => {
        // Alert.alert("Success!", "Success!", [{ text: "ok" }]);
        console.log(res);
      })
      .catch((e) => {
        // Alert.alert("Fail!", '', [{ text: "ok" }]);
        console.log(e);
      });
  };

  React.useEffect(() => {
    listStaff();
  }, [refreshing]);

  const closeRow = async (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const editRow = async (rowMap, rowKey, nv) => {
    navigation.navigate("TabAdminHomeEditStaff", { itemData: nv });
  };

  const deleteRow = async (rowMap, rowKey, matk) => {
    closeRow(rowMap, rowKey);
    await deleteStaff(matk);
    const newData = [...staff];
    const prevIndex = staff.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setStaff(newData);
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
        <TouchableHighlight
          key={data.item.key}
          style={styles.rowFrontVisible}
          onPress={() => console.log("Element touched")}
          underlayColor={"#aaa"}
        >
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {data.item.manv}
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              {data.item.ten}
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
          deleteRow(rowMap, data.item.key, data.item.taikhoan.matk)
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
        onClose={() => editRow(rowMap, data.item.key, data.item)}
        onDelete={() =>
          deleteRow(rowMap, data.item.key, data.item.taikhoan.matk)
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      > */}
        <StatusBar barStyle="dark-content" />
        {/* <StatusBar backgroundColor="#FF6347" barStyle="light-content"/> */}
        <SwipeListView
          data={staff}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          onRowDidOpen={onRowDidOpen}
          leftActivationValue={100}
          rightActivationValue={-200}
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
      {/* </ScrollView> */}
    </View>

  );
}

export default StaffScreen;

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
    height: 60,
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
    height: 60,
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
