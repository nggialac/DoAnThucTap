import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryStack,
  VictoryPie,
  VictoryTooltip,
} from "victory-native";
import { getRevenue } from "../../api/StatisticApis";
import { Picker } from "@react-native-picker/picker";

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  // { quarter: 4, earnings: 19000 },
  // { quarter: 5, earnings: 19000 },
  // { quarter: 6, earnings: 19000 },
  // { quarter: 7, earnings: 19000 },
  // { quarter: 8, earnings: 19000 },
  // { quarter: 9, earnings: 19000 },
  // { quarter: 10, earnings: 19000 },
  // { quarter: 11, earnings: 19000 },
  // { quarter: 12, earnings: 19000 },
];

export default function AdminStatisticScreen() {
  const [selectedQuarter, setSelectedQuarter] = useState(0);
  const [revenue, setRevenue] = useState([]);

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
  }, []);

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
    <View style={{ flex: 1 }}>
      <View style={styles.pickerWrap}>
        <Text style={styles.textTitle}>
          Doanh thu hàng tháng năm {new Date().getFullYear()}
        </Text>
        {/* <Picker
          selectedValue={selectedQuarter}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedQuarter(itemValue)
          }
        >
          <Picker.Item label="Quý 1" value={1} />
          <Picker.Item label="Quý 2" value={2} />
          <Picker.Item label="Quý 3" value={3} />
          <Picker.Item label="Quý 4" value={4} />
        </Picker> */}
      </View>

      <View style={styles.container}>
        <VictoryChart
          // domainPadding will add space to each side of VictoryBar to
          // prevent it from overlapping the axis
          domainPadding={50}
          theme={VictoryTheme.material}
          // animate={{duration: 500}}
        >
          <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            // tickValues={columnQuarter(selectedQuarter)}
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
});
