import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryPie,
  VictoryTheme,
} from "victory-native";
import {
  getDoanhThuByTrangThai,
  getDoanhThuByTrangThaiByDate,
} from "../../../api/StatisticApis";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function OrderStatisticScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  var listTrangthai = {
    0: "CD",
    1: "DD",
    2: "DG",
    3: "TC",
    4: "DH",
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
    // listOrder(from);
    setShowTo(false);
    setShowFrom(false);
  }, [refreshing]);

  const listOrder = async (from: string, to: string) => {
    console.log(from, to);
    await getDoanhThuByTrangThaiByDate(from, to)
      .then((res) => {
        const total = res.data.reduce(function (acc, obj) {
          return acc + obj.sodon;
        }, 0);
        const temp = res.data.map((obj) => ({
          ...obj,
          label: listTrangthai[obj.trangthai] + `(${obj.sodon})`,
        }));
        setTotalOrder(total);
        setOrders(temp);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const [totalOrder, setTotalOrder] = useState(0);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const onChangeFrom = (event, selectedDate) => {
    if (selectedDate.getTime() < new Date().getTime() && selectedDate.getTime() <= dateTo.getTime()) {
      const currentDate = selectedDate || dateFrom;
      setShowFrom(Platform.OS === "ios");
      setDateFrom(currentDate);
    } else {
      Alert.alert("Notice", "Ngày không thể lớn hơn hiện tại!");
      setShowFrom(Platform.OS === "ios");
    }
  };

  const onChangeTo = (event, selectedDate) => {
    if (selectedDate.getTime() < new Date().getTime() && selectedDate.getTime() >= dateFrom.getTime()) {
      const currentDate = selectedDate || dateTo;
      setShowTo(Platform.OS === "ios");
      setDateTo(currentDate);
    } else {
      Alert.alert("Notice", "Ngày không thể lớn hơn hiện tại!");
      setShowTo(Platform.OS === "ios");
    }
  };

  const showModeFrom = () => {
    setShowFrom(true);
  };

  const showModeTo = () => {
    setShowTo(true);
  };

  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 30,
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.datePicker}>
            <TouchableOpacity
              onPress={showModeFrom}
              style={{ alignItems: "center" }}
            >
              <Text style={styles.pickerText}>From</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.datePicker}>
            <TouchableOpacity
              onPress={showModeTo}
              style={{ alignItems: "center" }}
            >
              <Text style={styles.pickerText}>To</Text>
            </TouchableOpacity>
          </View>
          {showFrom && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateFrom}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeFrom}
            />
          )}
          {showTo && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateTo}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeTo}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            margin: 30,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#999", fontSize: 14 }}>
            Từ ngày: {dateFrom.getDate()}/{dateFrom.getMonth() + 1}/
            {dateFrom.getFullYear()}
          </Text>
          <Text style={{ fontWeight: "bold", color: "#999", fontSize: 14 }}>
            Đến ngày: {dateTo.getDate()}/{dateTo.getMonth() + 1}/
            {dateTo.getFullYear()}
          </Text>
        </View>
        <View>
          <View
            style={{
              height: 32,
              flex: 1,
              backgroundColor: "#694fad",
              marginHorizontal: 30,
              alignContent: "center",
              marginRight: 42,
            }}
          >
            <TouchableOpacity
              onPress={async() =>
                {var temp = new Date();
                  temp.setDate(dateTo.getDate()+1);
                await listOrder(
                  dateFrom.getFullYear().toString() +
                    "-" +
                    (dateFrom.getMonth() + 1).toString() +
                    "-" +
                    dateFrom.getDate().toString(),
                    temp.getFullYear().toString() +
                    "-" +
                    (temp.getMonth() + 1).toString() +
                    "-" +
                    (temp.getDate()).toString()
                )}
              }
              style={{ alignItems: "center" }}
            >
              <Text style={styles.pickerText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {orders !== [] || orders !== null ? (
          <View>
            <View style={styles.pickerWrap}>
              <Text style={styles.textTitle}>
                Tình trạng đơn hàng theo ngày
              </Text>
            </View>
            <View style={styles.container}>
              <VictoryPie
                // startAngle={90}
                innerRadius={({ datum }) => datum.trangthai * 20}
                padAngle={({ datum }) => datum.tien}
                style={{
                  labels: {
                    fill: "black",
                    fontSize: 14,
                    fontWeight: "bold",
                    padding: 4,
                    // margin: 0,
                    // paddingInline: 0,
                  },
                }}
                data={orders}
                x="trangthai"
                y="sodon"
                labelPosition={({ index }) =>
                  index ? "centroid" : "startAngle"
                }
                labelPlacement={({ index }) =>
                  index ? "parallel" : "vertical"
                }
              />
            </View>
            <View style={styles.pickerWrap}>
              <Text style={styles.textTitle}>
                Tổng số lượng đơn: {totalOrder}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
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
  pickerText: { fontSize: 20, color: "#fff", backgroundColor: "#694fad" },
});
