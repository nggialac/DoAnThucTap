import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ScrollView,
  RefreshControl,
  Platform,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
} from "victory-native";
import { getRevenue, getRevenueByFromTo } from "../../../api/StatisticApis";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DateToDateScreen() {
  // const [selectedQuarter, setSelectedQuarter] = useState(0);
  const [revenue, setRevenue] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const onChangeFrom = (event, selectedDate) => {
    const currentDate = selectedDate || dateFrom;
    setShowFrom(Platform.OS === "ios");
    setDateFrom(currentDate);
  };

  const onChangeTo = (event, selectedDate) => {
    const currentDate = selectedDate || dateTo;
    setShowTo(Platform.OS === "ios");
    setDateTo(currentDate);
  };

  const showModeFrom = () => {
    setShowFrom(true);
  };

  const showModeTo = () => {
    setShowTo(true);
  };

  const getRevenueOfMonth = () => {
    getRevenue()
      .then((res) => {
        console.log(res.data);
        setRevenue(res.data);
        // test(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail!", "Cannot fetch data");
      });
  };

  const getRevenueFromTo = (from: string, to: string) => {
    getRevenueByFromTo(from, to)
      .then((res) => {
        console.log(res.data);
        setRevenueDay(res.data);
        // test(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail!", "Cannot fetch data");
      });
  };

  useEffect(() => {
    getRevenueOfMonth();
    // getRevenueFromTo("2021-08-24", "2021-08-26");
  }, [refreshing]);

  const [revenueDay, setRevenueDay] = useState([]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 20, marginTop: 30, flex: 1 }}>
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

          <View>
            <Text style={{ fontWeight: "bold", color: "#999", fontSize: 14 }}>
              Từ ngày: {dateFrom.getDate()}/{dateFrom.getMonth() + 1}/
              {dateFrom.getFullYear()}
            </Text>
            <Text style={{ fontWeight: "bold", color: "#999", fontSize: 14 }}>
              Đến ngày: {dateTo.getDate()}/{dateTo.getMonth() + 1}/
              {dateTo.getFullYear()}
            </Text>
          </View>

          <View style={styles.datePicker}>
            <TouchableOpacity
              onPress={() =>
                getRevenueFromTo(
                  dateFrom.getFullYear().toString() +
                    "-" +
                    (dateFrom.getMonth() + 1).toString() +
                    "-" +
                    dateFrom.getDate().toString(),
                  dateTo.getFullYear().toString() +
                    "-" +
                    (dateTo.getMonth() + 1).toString() +
                    "-" +
                    dateTo.getDate().toString()
                )
              }
              style={{ alignItems: "center" }}
            >
              <Text style={styles.pickerText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.pickerWrap}>
            <Text style={styles.textTitle}>Doanh thu theo ngày</Text>
          </View>
          <View style={styles.container}>
            <VictoryChart
              domainPadding={50}
              theme={VictoryTheme.material}
              // animate={{duration: 500}}
            >
              <VictoryAxis
                // tickValues={monthOfQuarter[selectedQuarter]}
                tickFormat={(x) => `Ngày ${x}`}
              />
              <VictoryAxis
                dependentAxis
                // tickFormat specifies how ticks should be displayed
                tickFormat={(x) => `$${x / 1000000}tr`}
              />
              <VictoryBar data={revenueDay} x="ngay" y="tien" />
            </VictoryChart>
          </View>
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 20,
    justifyContent: "center",
  },
  pickerText: { fontSize: 20, color: "#fff" },
});
