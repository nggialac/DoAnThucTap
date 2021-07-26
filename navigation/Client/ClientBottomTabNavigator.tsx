import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
// import TabOneScreen from "../../screens/TabOneScreen";
// import TabTwoScreen from "../../screens/TabTwoScreen";
// import TabThreeScreen from "../../screens/TabThreeScreen";
import TabClientHomeScreen from '../../screens/Client/ClientHomeScreen';
import TabClientCategoriesScreen from '../../screens/Client/ClientCategoriesScreen';
import TabClientProfileScreen from '../../screens/Client/ClientProfileScreen';

import {
  BottomTabClientParamList,
  TabClientHomeParamList,
  TabClientCategoriesParamList,
  TabClientProfileParamList
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
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
            <BottomTab.Screen
        name="Categories"
        component={ClientTabCategoriesNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
            <BottomTab.Screen
        name="Profile"
        component={ClientTabProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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
        options={{ headerTitle: "Tab Client Home Title" }}
      />
    </TabClientHomeStack.Navigator>
  );
}

const TabClientCategoriesStack = createStackNavigator<TabClientCategoriesParamList>();

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

function ClientTabProfileNavigator() {
  return (
    <TabClientProfileStack.Navigator>
      <TabClientProfileStack.Screen
        name="TabClientProfileScreen"
        component={TabClientProfileScreen}
        options={{ headerTitle: "Tab Client Profile Title" }}
      />
    </TabClientProfileStack.Navigator>
  );
}