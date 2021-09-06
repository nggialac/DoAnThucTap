import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function AdminStatisticScreen({ navigation }) {

  return (
      <View style={styles.container}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Today's Tasks */}
          <View style={styles.tasksWrapper}>
            <Text style={styles.sectionTitle}>Statistic's Functions</Text>
            <View style={styles.items}>
              <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('DateToDateScreen')}>
                <View style={styles.itemLeft}>
                  <View style={styles.square}>
                    <Icon name="file-alert-outline" color="#FF6347" size={25} />
                  </View>
                  <Text style={styles.itemText}>Revenue From Date To Date</Text>
                </View>
                <View style={styles.circular}></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('StatisticByMonthScreen')}>
                <View style={styles.itemLeft}>
                  <View style={styles.square}>
                    <Icon name="file-cabinet" color="#FF6347" size={25} />
                  </View>
                  <Text style={styles.itemText}>Revenue By Month of Year</Text>
                </View>
                <View style={styles.circular}></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('OrderStatisticScreen')}>
                <View style={styles.itemLeft}>
                  <View style={styles.square}>
                    <Icon name="file-certificate" color="#FF6347" size={25} />
                  </View>
                  <Text style={styles.itemText}>Order Statistic Ratio By Date</Text>
                </View>
                <View style={styles.circular}></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('StockQuantityScreen')}>
                <View style={styles.itemLeft}>
                  <View style={styles.square}>
                    <Icon name="file-chart" color="#FF6347" size={25} />
                  </View>
                  <Text style={styles.itemText}>Stock Quantity Statistic</Text>
                </View>
                <View style={styles.circular}></View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},
  item: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 36,
    height: 36,
    // backgroundColor: "#55BCF6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "80%",
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: "#55BCF6",
    borderWidth: 2,
    borderRadius: 5,
  },
});
