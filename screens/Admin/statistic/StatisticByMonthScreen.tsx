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
} from "victory-native";
import { getRevenue, getRevenueByFromTo } from "../../../api/StatisticApis";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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

  useEffect(() => {
    getRevenueOfMonth();
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

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1 }}>
        <View style={styles.pickerWrap}>
          <Text style={styles.textTitle}>
            Doanh thu hàng tháng năm {new Date().getFullYear()}
          </Text>
        </View>

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
              tickFormat={(x) => `$${x / 1000000}tr`}
            />
            <VictoryBar data={revenue.sort(compare)} x="thang" y="tien" />
          </VictoryChart>
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
