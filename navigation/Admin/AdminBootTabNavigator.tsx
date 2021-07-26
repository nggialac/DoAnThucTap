import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
// import TabOneScreen from "../../screens/TabOneScreen";
// import TabTwoScreen from "../../screens/TabTwoScreen";
// import TabThreeScreen from "../../screens/TabThreeScreen";
import TabAdminHomeScreen from '../../screens/Admin/AdminHomeScreen';
import TabAdminStatisticScreen from '../../screens/Admin/AdminStatisticScreen';
import TabAdminCommentsScreen from '../../screens/Admin/AdminCommentsScreen';
import TabAdminProfileScreen from '../../screens/Admin/AdminProfileScreen';

import {
  BottomTabAdminParamList,
  TabAdminHomeParamList,

  TabAdminCommentsParamList,
  TabAdminStatisticParamList,
  TabAdminProfileParamList,
} from "../../types";

const BottomTab = createBottomTabNavigator<BottomTabAdminParamList>();

export default function AdminBottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Home"
        component={AdminTabHomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
            <BottomTab.Screen
        name="Statistic"
        component={AdminTabStatisticNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
            <BottomTab.Screen
        name="Comments"
        component={AdminTabCommentsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
            <BottomTab.Screen
        name="Profile"
        component={AdminTabProfileNavigator}
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

const TabAdminHomeStack = createStackNavigator<TabAdminHomeParamList>();

function AdminTabHomeNavigator() {
  return (
    <TabAdminHomeStack.Navigator>
      <TabAdminHomeStack.Screen
        name="TabAdminHomeScreen"
        component={TabAdminHomeScreen}
        options={{ headerTitle: "Tab Admin Home Title" }}
      />
    </TabAdminHomeStack.Navigator>
  );
}

const TabAdminStatisticStack = createStackNavigator<TabAdminStatisticParamList>();

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

function AdminTabProfileNavigator() {
  return (
    <TabAdminProfileStack.Navigator>
      <TabAdminProfileStack.Screen
        name="TabAdminProfileScreen"
        component={TabAdminProfileScreen}
        options={{ headerTitle: "Tab Profile Home Title" }}
      />
    </TabAdminProfileStack.Navigator>
  );
}