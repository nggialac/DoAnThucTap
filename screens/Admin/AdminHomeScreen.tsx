import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../../components/ContextLogin";

export default function AdminHomeScreen({ navigation }) {
  const context = React.useContext(AuthContext);
  const nhanvien = context.loginState.mnv_mnt;
  console.log(nhanvien);

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
          <Text style={styles.sectionTitle}>Admin's Functions</Text>
          <View style={styles.items}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("TabAdminHomeOrder")}
            >
              <View style={styles.itemLeft}>
                <View style={styles.square}>
                  <Icon name="party-popper" color="#FF6347" size={25} />
                </View>
                <Text style={styles.itemText}>ORDERS</Text>
              </View>
              <View style={styles.circular}></View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("TabAdminHomeClient")}
            >
              <View style={styles.itemLeft}>
                <View style={styles.square}>
                  <Icon name="account-box" color="#FF6347" size={25} />
                </View>
                <Text style={styles.itemText}>CLIENTS</Text>
              </View>
              <View style={styles.circular}></View>
            </TouchableOpacity>
            {nhanvien.taikhoan.quyen.maquyen == 1 ? (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("TabAdminHomeStaff")}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.square}>
                    <Icon name="account" color="#FF6347" size={25} />
                  </View>
                  <Text style={styles.itemText}>STAFFS</Text>
                </View>
                <View style={styles.circular}></View>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("TabAdminHomeProduct")}
            >
              <View style={styles.itemLeft}>
                <View style={styles.square}>
                  <Icon name="folder-text" color="#FF6347" size={25} />
                </View>
                <Text style={styles.itemText}>MEDICINES</Text>
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
