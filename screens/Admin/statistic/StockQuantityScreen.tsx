import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, View, StyleSheet, Text } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryHistogram,
  VictoryTheme,
} from "victory-native";
import {
  getListCategoryMedicine,
  getListMedicine,
} from "../../../api/MedicineApis";

export default function StockQuantityScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const [data, setData] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [selected, setSelected] = React.useState();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    listData();
    listCategory();
  }, [refreshing]);

  const listData = async () => {
    await getListMedicine()
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const listCategory = async () => {
    await getListCategoryMedicine()
      .then((res) => {
        // console.log(res.data);
        setCategory(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "" + e, [{ text: "ok" }]);
      });
  };

  const selectData = (itemValue) => {
    setSelected(itemValue);
    // console.log(itemValue);
    var newArray = data.filter(function (item) {
      return item.danhmuc.madm == itemValue;
    });
    // console.log(newArray);
    // setData(newArray);
    setTemp(newArray);
  };

  const [temp, setTemp] = useState([]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Số lượng tồn theo danh mục</Text>
      </View>

      <View>
        <Picker
          style={styles.picker}
          // style={styles.textInput}
          numberOfLines={5}
          selectedValue={selected}
          onValueChange={(itemValue, itemIndex) => selectData(itemValue)}
        >
          {category
            ? category.map((item, index) => {
                return <Picker.Item label={item.tendm} value={item.madm} key={index}/>;
              })
            : null}
        </Picker>
      </View>
      <View style={styles.charts}>
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
            tickFormat={(x) => `${x}`}
          />

          <VictoryBar
            data={temp}
            x="tensp"
            y="soluong"
            horizontal
            style={{
              data: { fill: "#c43a31", stroke: "black", strokeWidth: 2, width: 8, },
    
            }}
            // key={temp=>temp.masp.toString()}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10
  },
  title: {
    textAlign:"center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 50,
  },
  picker: {
    fontSize: 30,
    fontWeight: "bold",
  },
  charts: {
    marginLeft: 20,
  },
});
