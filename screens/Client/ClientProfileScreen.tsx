import * as React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import {
  Avatar,
  Caption,
  Title,
  Text,
  TouchableRipple,
} from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// import files from '../assets/filesBase64';
// import Share from 'react-native-share';
import { AuthContext } from "../../components/ContextLogin";

export default function ClientProfileScreen({ navigation }) {
  const context = React.useContext(AuthContext);
  // const nhathuoc = JSON.parse(context.loginState.mnv_mnt);
  const nhathuoc = context.loginState.mnv_mnt;
  // console.log(context.loginState);

  const signOut = React.useContext(AuthContext);

  const logoutHandle = () => {
    Alert.alert("Notice", "You wanna logout ?", [
      {
        text: "Yes",
        onPress: () => {
          navigation.navigate("TabClientHomeScreen");
          signOut.authContext.signOut();
          ToastAndroid.showWithGravity(
            "You are now logged out!",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        },
      },
      {
        text: "Ask me later",
        onPress: () => {},
      },
    ]);

    // console.log(signOut);
  };

  const checkHandle = async () => {
    // await navigation.navigate("TabClientHomeScreen");
    signOut.authContext.check();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <Avatar.Image
              source={{
                uri: "https://st.gamevui.com/images/image/2020/09/17/AmongUs-Avatar-maker-hd01.jpg",
              }}
              size={80}
            />
            <View style={{ marginLeft: 20 }}>
              <Title style={[styles.title, { marginTop: 15, marginBottom: 5 }]}>
                {nhathuoc !== null ? nhathuoc.tennhathuoc : "Guest"}
              </Title>
              <Caption style={styles.caption}>
                {nhathuoc !== null ? nhathuoc.manhathuoc : "Not available"}
              </Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" size={20} color="#777777" />
            <Text style={styles.infoLocation}>
              {nhathuoc !== null ? nhathuoc.diachi : "Not available"}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" size={20} color="#777777" />
            <Text style={styles.infoLocation}>
              {nhathuoc !== null ? nhathuoc.sdt : "Not available"}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" size={20} color="#777777" />
            <Text style={styles.infoLocation}>
              {nhathuoc !== null ? nhathuoc.email : "Not available"}
            </Text>
          </View>
        </View>

        <View style={styles.infoBoxWrapper}>
          {/* <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title>₹140.50</Title>
            <Caption>Wallet</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>12</Title>
            <Caption>Orders</Caption>
          </View> */}
        </View>

        <View style={styles.menuWrapper}>
          {nhathuoc !== null ? (
            <View>
              <TouchableRipple
                onPress={() => navigation.navigate("CartScreen")}
              >
                <View style={styles.menuItem}>
                  <Icon name="cart-outline" color="#FF6347" size={25} />
                  <Text style={styles.menuItemText}>Your Cart</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate("BuyHistoryScreen");
                }}
              >
                <View style={styles.menuItem}>
                  <Icon name="history" color="#FF6347" size={25} />
                  <Text style={styles.menuItemText}>Buy History</Text>
                </View>
              </TouchableRipple>
            </View>
          ) : null}
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="account-check-outline" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Support</Text>
            </View>
          </TouchableRipple>
          {nhathuoc !== null ? (
            <TouchableRipple onPress={logoutHandle}>
              <View style={styles.menuItem}>
                <Icon name="file-settings-outline" color="#FF6347" size={25} />
                <Text style={styles.menuItemText}>Sign Out</Text>
              </View>
            </TouchableRipple>
          ) : (
            <TouchableRipple onPress={checkHandle}>
              <View style={styles.menuItem}>
                <Icon name="file-settings-outline" color="#FF6347" size={25} />
                <Text style={styles.menuItemText}>Sign In</Text>
              </View>
            </TouchableRipple>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  infoLocation: {
    color: "#777777",
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    // borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 10,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
