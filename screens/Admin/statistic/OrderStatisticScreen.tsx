import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryPie,
  VictoryTheme,
} from "victory-native";
import { getListOrder } from "../../../api/OrderApis";

export default function OrderStatisticScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  var listTrangthai = {
    0: "Chờ xử lý",
    1: "Đã duyệt",
    2: "Đang giao",
    3: "Giao hàng thành công",
    4: "Đã hủy",
  };

  const [orders, setOrders] = React.useState([]);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
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
        filter(newArr);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const [chartData, setChartData] = useState();
  const filter = (data) => {
    var res = {};
    data.forEach(function (v) {
      res[v.trangthai] = (res[v.trangthai] || 0) + 1;
    });
    // console.log(res);
    setChartData(res);
  };

//   var arr = [];
//   var len = orders.length;
//   for (var i = 0; i < len; i++) {
//       arr.push({
//           key: orders.trangthai,
//         value: (orders.trangthai || 0) + 1;
//       });
//   }

  return (
    <View>
      <View style={styles.container}>
        {/* {filter(orders)} */}
        {/* <VictoryPie
          data={orders}
          x=
          y="trangthai"
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
    paddingLeft: 20,
  },
  pickerWrap: {
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 30,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  datePicker: {
    backgroundColor: "#694fad",
    height: 50,
    width: 100,
    marginBottom: 0,
    justifyContent: "center",
    marginRight: 16,
  },
  pickerText: { fontSize: 20, color: "#fff" },
});
