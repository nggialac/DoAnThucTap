import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import useColorScheme from "../../hooks/useColorScheme";
// import TabOneScreen from "../../screens/TabOneScreen";
// import TabTwoScreen from "../../screens/TabTwoScreen";
// import TabThreeScreen from "../../screens/TabThreeScreen";
import TabAdminHomeScreen from "../../screens/Admin/AdminHomeScreen";
import TabAdminStatisticScreen from "../../screens/Admin/AdminStatisticScreen";
import TabAdminCommentsScreen from "../../screens/Admin/AdminCommentsScreen";
import TabAdminProfileScreen from "../../screens/Admin/AdminProfileScreen";
import EditProfileScreen from "../../screens/Admin/profile/EditProfileScreen";
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

function AdminTabProfileNavigator({navigation}) {
  const {colors} = useTheme();
  return (
    <TabAdminProfileStack.Navigator
      screenOptions={{
        headerStyle:{
          backgroundColor: colors.background,
          shadowColor: colors.background, //IOS
          elevation: 0 //ANDROID
        },
        headerTintColor:'#000',
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
              backgroundColor= {colors.background}
              color= {colors.text}
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
    </TabAdminProfileStack.Navigator>
  );
}
