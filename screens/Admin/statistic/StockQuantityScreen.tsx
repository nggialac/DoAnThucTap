import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, View, StyleSheet, Text, ScrollView } from "react-native";
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
import { DataTable } from "react-native-paper";

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
    setPage(0);
  }, [refreshing, itemsPerPage]);

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
    // setItemsPerPage(newArray)
  };

  const [temp, setTemp] = useState([]);

  //DATALIST
  const optionsPerPage = [2, 3, 4];
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Số lượng tồn theo danh mục</Text>
        </View>

        <View>
          <Text style={{marginHorizontal: 6, fontSize: 20, fontStyle: "italic", fontWeight: "bold"}}>Danh mục</Text>
          <Picker
            style={styles.picker}
            // style={styles.textInput}
            numberOfLines={5}
            selectedValue={selected}
            onValueChange={(itemValue, itemIndex) => selectData(itemValue)}
          >
            {category
              ? category.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.tendm}
                      value={item.madm}
                      key={index}
                    />
                  );
                })
              : null}
          </Picker>
        </View>
        {/* <View style={styles.charts}>
          <VictoryChart domainPadding={50} theme={VictoryTheme.material}>
            <VictoryAxis tickFormat={(x) => `${x}`} />
            <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />

            <VictoryBar
              data={temp}
              x="tensp"
              y="soluong"
              horizontal
              style={{
                data: {
                  fill: "#c43a31",
                  stroke: "black",
                  strokeWidth: 2,
                  width: 8,
                },
              }}
            />
          </VictoryChart>
        </View> */}
        <View style={{marginTop: 30}}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Tên sản phẩm</DataTable.Title>
              <DataTable.Title numeric>Số lượng tồn</DataTable.Title>
              {/* <DataTable.Title numeric>Fat</DataTable.Title> */}
            </DataTable.Header>
            {temp.slice(page * 5, page * 5 + 5).map((repo) => (
              <DataTable.Row
                key={repo.tensp.toString()}
                onPress={() => Alert.alert("Notice", `${repo.tensp}`)}
              >
                <DataTable.Cell>{repo.tensp}</DataTable.Cell>
                <DataTable.Cell numeric>{repo.soluong}</DataTable.Cell>
                {/* <DataTable.Cell numeric>6.0</DataTable.Cell> */}
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.round(temp.length / 5)}
              onPageChange={(page) => setPage(page)}
              label={
                "Page " + (page + 1) + " of " + Math.round(temp.length / 5)
              }
              // optionsPerPage={optionsPerPage}
              // itemsPerPage={itemsPerPage}
              // setItemsPerPage={setItemsPerPage}
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
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    textAlign: "center",
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
