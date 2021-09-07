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
  VictoryStack,
  VictoryPie,
  VictoryTooltip,
  VictoryLabel,
} from "victory-native";
import { getRevenue, getRevenueByFromTo } from "../../../api/StatisticApis";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import COLORS from "../../../assets/colors/Colors";

export default function StatisticByMonthScreen() {
  const [revenue, setRevenue] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const getRevenueOfMonth = (year) => {
    getRevenue(year)
      .then((res) => {
        console.log(res.data);
        // setRevenue(res.data);
        const temp = res.data.map(obj=> ({ ...obj, label: currencyFormat(obj.tien) }))
        // test(res.data);
        setRevenue(temp);
        // console.log(temp);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail!", "Cannot fetch data");
      });
  };

  useEffect(() => {
    // getRevenueOfMonth(2021);
    // getRevenueFromTo("2021-08-24", "2021-08-26");
  }, [refreshing]);

  function columnQuarter(selectedQuarter: number) {
    switch (selectedQuarter) {
      case 1:
        return [1, 2, 3];
      case 2:
        return [4, 5, 6];
      case 3:
        return [7, 8, 9];
      case 4:
        return [10, 11, 12];
      default:
        return [1, 2, 3];
    }
  }

  function columnName(selectedQuarter: number) {
    switch (selectedQuarter) {
      case 1:
        return ["Tháng 1", "Tháng 2", "Tháng 3"];
      case 2:
        return ["Tháng 4", "Tháng 5", "Tháng 6"];
      case 3:
        return ["Tháng 7", "Tháng 8", "Tháng 9"];
      case 4:
        return ["Tháng 10", "Tháng 11", "Tháng 12"];
      default:
        return ["Tháng 1", "Tháng 2", "Tháng 3"];
    }
  }

  function compare(a, b) {
    const temp1 = parseInt(a.thang);
    const temp2 = parseInt(b.thang);
    if (temp1 < temp2) {
      return -1;
    }
    if (temp1 > temp2) {
      return 1;
    }
    return 0;
  }

  const [year, setYear] = useState(new Date().getFullYear());

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
        <View style={styles.pickerWrap}>
          <Text style={styles.textTitle}>Doanh thu hàng tháng năm</Text>
          <TextInput
            value={year.toString()}
            onChangeText={(e) =>
              e.length < 5 && parseInt(e) <= new Date().getFullYear()
                ? setYear(e)
                : Alert.alert("Failed", "Invalid data! Length text < 5 and must be smaller current year.")
            }
            keyboardType={"number-pad"}
            style={{
              marginLeft: 10,
              backgroundColor: COLORS.light,
              fontSize: 20,
            }}
          />
        </View>

        {typeof revenue !== "undefined" && revenue.length > 0 ? (
          <View style={styles.container}>
            <VictoryChart
              domainPadding={50}
              theme={VictoryTheme.material}
              
              // animate={{duration: 500}}
            >
              <VictoryAxis
                // tickValues={monthOfQuarter[selectedQuarter]}
                tickFormat={(x) => `Tháng ${x}`}
              />
              <VictoryAxis
                dependentAxis
                // tickFormat specifies how ticks should be displayed
                tickFormat={(x) => `${x / 1000000}tr`}
              />
              <VictoryBar
                data={revenue.sort(compare)}
                x="thang"
                y="tien"
                width={50}
                height={100}
                
                labelComponent={
                  <VictoryLabel
                    dy={-20}
                    // backgroundStyle={{ fill: "tomato", opacity: 0.6 }}
                    backgroundPadding={{ bottom: 5, top: 5 }}
                  />
                }
              />
            </VictoryChart>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={{ marginTop: 30, fontSize: 20, fontWeight: "bold" }}>
              EMPTY DATA!
            </Text>
          </View>
        )}
      </View>
      <View>
        <Button
          onPress={() =>
            year > 2000 && year < 2100
              ? getRevenueOfMonth(year)
              : Alert.alert(
                  "Failed",
                  "Invalid data! (year > 2000)"
                )
          }
          title="Submit!"
        />
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
    flex: 1,
    flexDirection: "row",
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
