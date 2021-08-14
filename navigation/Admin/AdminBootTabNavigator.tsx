import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import useColorScheme from "../../hooks/useColorScheme";
// import TabOneScreen from "../../screens/TabOneScreen";
// import TabTwoScreen from "../../screens/TabTwoScreen";
// import TabThreeScreen from "../../screens/TabThreeScreen";
import TabAdminHomeScreen from "../../screens/Admin/AdminHomeScreen";
import TabAdminHomeOrder from "../../screens/Admin/order/OrderScreen";
import TabAdminHomeStaff from "../../screens/Admin/staff/StaffScreen";
import TabAdminHomeProduct from "../../screens/Admin/medicine/MedicineScreen";
import TabAdminHomeProductList from "../../screens/Admin/medicine/MedicineListScreen";
import TabAdminHomeProductDetail from "../../screens/Admin/medicine/DetailMedicineScreen";
import TabAdminHomeEditProduct from "../../screens/Admin/medicine/EditMedicineScreen";
import TabAdminHomeAddProduct from "../../screens/Admin/medicine/AddMedicineScreen";

import TabAdminStatisticScreen from "../../screens/Admin/AdminStatisticScreen";
import TabAdminCommentsScreen from "../../screens/Admin/AdminCommentsScreen";
import TabAdminProfileScreen from "../../screens/Admin/AdminProfileScreen";
import EditProfileScreen from "../../screens/Admin/profile/EditProfileScreen";
import PaymentScreen from "../../screens/Admin/profile/PaymentScreen";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  BottomTabAdminParamList,
  TabAdminHomeParamList,
  TabAdminCommentsParamList,
  TabAdminStatisticParamList,
  TabAdminProfileParamList,
} from "../../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { View } from "react-native";

// const BottomTab = createBottomTabNavigator<BottomTabAdminParamList>();
const BottomTab = createMaterialBottomTabNavigator<BottomTabAdminParamList>();

export default function AdminBottomTabNavigator() {
  // const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "#694fad" }}
      // tabBarOptions={{ activeTintColor: Colors[colorScheme].tint, keyboardHidesTabBar: true, }}
    >
      <BottomTab.Screen
        name="Home"
        component={AdminTabHomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-home" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Statistic"
        component={AdminTabStatisticNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-stats-chart" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Comments"
        component={AdminTabCommentsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-chatbox" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={AdminTabProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-person" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

const TabAdminHomeStack = createStackNavigator<TabAdminHomeParamList>();

function AdminTabHomeNavigator({ navigation }) {
  const { colors } = useTheme();

  return (
    <TabAdminHomeStack.Navigator>
      <TabAdminHomeStack.Screen
        name="TabAdminHomeScreen"
        component={TabAdminHomeScreen}
        options={{ headerTitle: "Tab Admin Home Title" }}
      />
      <TabAdminHomeStack.Screen
        name="TabAdminHomeOrder"
        component={TabAdminHomeOrder}
      />
      <TabAdminHomeStack.Screen
        name="TabAdminHomeStaff"
        component={TabAdminHomeStaff}
      />
      <TabAdminHomeStack.Screen
        name="TabAdminHomeProduct"
        component={TabAdminHomeProduct}
      />
      <TabAdminHomeStack.Screen
        name="TabAdminHomeProductList"
        component={TabAdminHomeProductList}
        options={({ route }) => ({
          title: route.params.madm,
          headerBackTitleVisible: false,
          // headerShown: false,
          headerRight: () => (
            <MaterialCommunityIcons.Button
                name="plus-box-multiple-outline"
                size={25}
                backgroundColor={colors.surface}
                color={colors.text}
                onPress={() => navigation.navigate("TabAdminHomeAddProduct")}
              />
          )
        })}
      />
      <TabAdminHomeStack.Screen
        name="TabAdminHomeProductDetail"
        component={TabAdminHomeProductDetail}
        options={({ route }) => ({
          itemData: route.params.itemData,
          headerBackTitleVisible: false,
          headerRight: () => (
            <View>
              {/* <MaterialCommunityIcons.Button
              name="account-edit"
              size={25}
              backgroundColor={colors.background}
              color={colors.text}
              onPress={() => navigation.navigate("EditProfileScreen")}
            /> */}
              <MaterialCommunityIcons.Button
                name="file-edit-outline"
                size={25}
                backgroundColor={colors.surface}
                color={colors.text}
                onPress={() => navigation.navigate("TabAdminHomeEditProduct", {itemData: route.params.itemData})}
              />
            </View>
          ),
        })}
      />
      <TabAdminHomeStack.Screen
        name="TabAdminHomeEditProduct"
        component={TabAdminHomeEditProduct}
        options={({ route }) => ({
          itemData: route.params.itemData,
          headerBackTitleVisible: false,
          // headerShown: false,
        })}
      />
      <TabAdminHomeStack.Screen
        name="TabAdminHomeAddProduct"
        component={TabAdminHomeAddProduct}
        options={() => ({
          headerBackTitleVisible: false,
          // headerShown: false,
        })}
      />
    </TabAdminHomeStack.Navigator>
  );
}

const TabAdminStatisticStack =
  createStackNavigator<TabAdminStatisticParamList>();

function AdminTabStatisticNavigator() {
  return (
    <TabAdminStatisticStack.Navigator>
      <TabAdminStatisticStack.Screen
        name="TabAdminStatisticScreen"
        component={TabAdminStatisticScreen}
        options={{ headerTitle: "Tab Statistic Home Title" }}
      />
    </TabAdminStatisticStack.Navigator>
  );
}

const TabAdminCommentsStack = createStackNavigator<TabAdminCommentsParamList>();

function AdminTabCommentsNavigator() {
  return (
    <TabAdminCommentsStack.Navigator>
      <TabAdminCommentsStack.Screen
        name="TabAdminCommentsScreen"
        component={TabAdminCommentsScreen}
        options={{ headerTitle: "Tab comments Home Title" }}
      />
    </TabAdminCommentsStack.Navigator>
  );
}

const TabAdminProfileStack = createStackNavigator<TabAdminProfileParamList>();

function AdminTabProfileNavigator({ navigation }) {
  const { colors } = useTheme();
  return (
    <TabAdminProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, //IOS
          elevation: 0, //ANDROID
        },
        headerTintColor: "#000",
      }}
    >
      <TabAdminProfileStack.Screen
        name="TabAdminProfileScreen"
        component={TabAdminProfileScreen}
        options={{
          headerTitle: "Tab Profile Home Title",
          headerRight: () => (
            <MaterialCommunityIcons.Button
              name="account-edit"
              size={25}
              backgroundColor={colors.background}
              color={colors.text}
              onPress={() => navigation.navigate("EditProfileScreen")}
            />
          ),
        }}
      />
      <TabAdminProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
        }}
      />
      <TabAdminProfileStack.Screen
        name="TabAdminProfilePaymentScreen"
        component={PaymentScreen}
        options={({ route }) => ({
          headerBackTitleVisible: false,
        })}
      />
    </TabAdminProfileStack.Navigator>
  );
}
