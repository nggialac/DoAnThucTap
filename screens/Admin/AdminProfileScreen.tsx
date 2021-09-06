import * as React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, ToastAndroid, Alert } from "react-native";
import {
  Avatar,
  Caption,
  Title,
  Text,
  TouchableRipple,
} from "react-native-paper";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
// import files from '../assets/filesBase64';
import Share from 'react-native-share';
import { AuthContext } from "../../components/ContextLogin";

export default function AdminProfileScreen({navigation}) {

  const signOut = React.useContext(AuthContext);

  const context = React.useContext(AuthContext);
  const nhanvien = context.loginState.mnv_mnt;

  const logoutHandle = () => {
    // signOut.authContext.signOut();
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image
            source={{
              uri: "https://iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
            }}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {marginTop: 15, marginBottom: 5}]}>{nhanvien.ten} {nhanvien.ho}</Title>
            <Caption style={styles.caption}>{nhanvien.manv}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
            <Icon name="map-marker-radius" size={20} color="#777777"/>
            <Text style={styles.infoLocation}>{nhanvien.diachi}</Text>
        </View>
        <View style={styles.row}>
            <Icon name="phone" size={20} color="#777777"/>
            <Text style={styles.infoLocation}>{nhanvien.sdt}</Text>
        </View>
        <View style={styles.row}>
            <Icon name="email" size={20} color="#777777"/>
            <Text style={styles.infoLocation}>{nhanvien.email}</Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={logoutHandle}>
          <View style={styles.menuItem}>
            <Icon name="file-settings-outline" color="#694fad" size={25}/>
            <Text style={styles.menuItemText}>Sign Out</Text>
          </View>
        </TouchableRipple>
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
    color: '#777777',
    marginLeft: 20
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
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
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
