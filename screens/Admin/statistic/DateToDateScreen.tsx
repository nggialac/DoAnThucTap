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
import { DataTable } from "react-native-paper";

export default function DateToDateScreen() {
  // const [selectedQuarter, setSelectedQuarter] = useState(0);
  const [revenue, setRevenue] = useState();
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
    if (
      selectedDate.getTime() < new Date().getTime() &&
      selectedDate.getTime() <= dateTo.getTime()
    ) {
      const currentDate = selectedDate || dateFrom;
      setShowFrom(Platform.OS === "ios");
      setDateFrom(currentDate);
    } else {
      Alert.alert("Notice", "Ngày không thể lớn hơn hiện tại và nhỏ hơn 'TO'!");
      setShowFrom(Platform.OS === "ios");
    }
  };

  const onChangeTo = (event, selectedDate) => {
    if (
      selectedDate.getTime() < new Date().getTime() &&
      selectedDate.getTime() >= dateFrom.getTime()
    ) {
      const currentDate = selectedDate || dateTo;
      setShowTo(Platform.OS === "ios");
      setDateTo(currentDate);
    } else {
      Alert.alert(
        "Notice",
        "Ngày không thể lớn hơn hiện tại và lớn hơn 'FROM'!"
      );
      setShowFrom(Platform.OS === "ios");
    }
  };

  const showModeFrom = () => {
    setShowFrom(true);
  };

  const showModeTo = () => {
    setShowTo(true);
  };

  // const getRevenueOfMonth = () => {
  //   getRevenue()
  //     .then((res) => {
  //       console.log(res.data);
  //       setRevenue(res.data);
  //       // test(res.data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       Alert.alert("Fail!", "Cannot fetch data");
  //     });
  // };

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
    // getRevenueOfMonth();
    // getRevenueFromTo("2021-08-24", "2021-08-26");
    setShowTo(false);
    setShowFrom(false);
  }, [refreshing]);

  const [revenueDay, setRevenueDay] = useState([]);

  //DATALIST
  const optionsPerPage = [2, 3, 4];
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
              onPress={async () => {
                var temp = new Date();
                await temp.setDate(dateTo.getDate() + 1);
                await getRevenueFromTo(
                  dateFrom.getFullYear().toString() +
                    "-" +
                    (dateFrom.getMonth() + 1).toString() +
                    "-" +
                    dateFrom.getDate().toString(),
                  temp.getFullYear().toString() +
                    "-" +
                    (temp.getMonth() + 1).toString() +
                    "-" +
                    (temp.getDate() + 1).toString()
                );
              }}
              style={{ alignItems: "center" }}
            >
              <Text style={styles.pickerText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* {revenueDay !== [] || revenueDay !== null ? (
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
                  tickFormat={(x) => `${x}`}
                />
                <VictoryAxis
                  dependentAxis
                  // tickFormat specifies how ticks should be displayed
                  tickFormat={(x) => `${x / 1000000}tr`}
                />
                <VictoryBar data={revenueDay} x="ngay" y="tien" />
              </VictoryChart>
            </View>
          </View>
        ) : (
          <Text style={styles.textTitle}>Không có dữ liệu</Text>
        )} */}

        <View style={{ marginTop: 30 }}>
          <View style={styles.pickerWrap}>
            <Text style={styles.textTitle}>Doanh Thu Theo Ngày</Text>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Ngày</DataTable.Title>
              <DataTable.Title numeric>Tiền</DataTable.Title>
              {/* <DataTable.Title numeric>Fat</DataTable.Title> */}
            </DataTable.Header>
            {revenueDay.slice(page * 5, page * 5 + 5).map((repo) => (
              <DataTable.Row
                key={repo.ngay.toString()}
                onPress={() => Alert.alert("Notice", `Ngày ${repo.ngay}`)}
              >
                <DataTable.Cell>{repo.ngay}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {currencyFormat(repo.tien)}
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.round(revenueDay.length / 5)}
              onPageChange={(page) => setPage(page)}
              label={
                "Page " +
                (page + 1) +
                " of " +
                Math.round(revenueDay.length / 5)
              }
              showFastPagination
              optionsLabel={"Rows per page"}
            />
          </DataTable>
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
    width: 100,
    marginBottom: 0,
    justifyContent: "center",
    marginRight: 16,
  },
  pickerText: { fontSize: 20, color: "#fff" },
});
