import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
// import TabOneScreen from "../../screens/TabOneScreen";
// import TabTwoScreen from "../../screens/TabTwoScreen";
// import TabThreeScreen from "../../screens/TabThreeScreen";
import TabClientHomeScreen from "../../screens/Client/ClientHomeScreen";
import DetailProductScreen from "../../screens/Client/product/DetailProductScreen";
import CartScreen from "../../screens/Client/cart/CartScreen";

import TabClientCategoriesScreen from "../../screens/Client/ClientCategoriesScreen";

import ClientProfileScreen from "../../screens/Client/ClientProfileScreen";
import ClientEditProfileScreen from "../../screens/Client/profile/EditProfileClientScreen";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import {
  BottomTabClientParamList,
  TabClientHomeParamList,
  TabClientCategoriesParamList,
  TabClientProfileParamList,
} from "../../types";

const BottomTab = createBottomTabNavigator<BottomTabClientParamList>();

export default function AdminBottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Home"
        component={ClientTabHomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Categories"
        component={ClientTabCategoriesNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="book-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ClientTabProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings-outline" color={color} />
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
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const TabClientHomeStack = createStackNavigator<TabClientHomeParamList>();

function ClientTabHomeNavigator() {
  return (
    <TabClientHomeStack.Navigator>
      <TabClientHomeStack.Screen
        name="TabClientHomeScreen"
        component={TabClientHomeScreen}
        options={{ headerTitle: "Tab Client Home Title", headerShown: false }}
      />
      <TabClientHomeStack.Screen
        name="DetailProductScreen"
        component={DetailProductScreen}
        options={{ headerTitle: "Client Detail Product Title", headerShown: false }}
      />
      <TabClientHomeStack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ headerTitle: "Client Cart Title", headerShown: false }}
      />
    </TabClientHomeStack.Navigator>
  );
}

const TabClientCategoriesStack =
  createStackNavigator<TabClientCategoriesParamList>();

function ClientTabCategoriesNavigator() {
  return (
    <TabClientCategoriesStack.Navigator>
      <TabClientCategoriesStack.Screen
        name="TabClientCategoriesScreen"
        component={TabClientCategoriesScreen}
        options={{ headerTitle: "Tab Client Categories Title" }}
      />
    </TabClientCategoriesStack.Navigator>
  );
}

const TabClientProfileStack = createStackNavigator<TabClientProfileParamList>();

function ClientTabProfileNavigator({ navigation }) {
  
  const { colors } = useTheme();

  return (
    <TabClientProfileStack.Navigator>
      {/* <TabClientProfileStack.Screen
        name="TabClientProfileScreen"
        component={TabClientProfileScreen}
        options={{ headerTitle: "Tab Client Profile Title" }}
      /> */}
            <TabClientProfileStack.Screen
        name="ClientProfileScreen"
        component={ClientProfileScreen}
        options={{
          headerTitle: "Tab Profile Home Title",
          headerRight: () => (
            <MaterialCommunityIcons.Button
              name="account-edit"
              size={25}
              backgroundColor={colors.background}
              color={colors.text}
              onPress={() => navigation.navigate("ClientEditProfileScreen")}
            />
          ),
        }}
      />
      <TabClientProfileStack.Screen
        name="ClientEditProfileScreen"
        component={ClientEditProfileScreen}
        options={{
          title: "Edit Profile",
        }}
      />
    </TabClientProfileStack.Navigator>
  );
}
