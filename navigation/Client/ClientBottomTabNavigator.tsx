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
import CheckOutScreen from "../../screens/Client/cart/CheckOutScreen";
import CheckOutCashScreen from "../../screens/Client/cart/CheckOutCashScreen";

import TabClientCategoriesScreen from "../../screens/Client/ClientCommentsScreen";

import ClientProfileScreen from "../../screens/Client/ClientProfileScreen";
import ClientEditProfileScreen from "../../screens/Client/profile/EditProfileClientScreen";
import BuyHistoryScreen from "../../screens/Client/profile/BuyHistoryScreen";
import DetailBuyHistoryScreen from "../../screens/Client/profile/DetailBuyHistoryScreen";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import {
  BottomTabClientParamList,
  TabClientHomeParamList,
  TabClientCategoriesParamList,
  TabClientProfileParamList,
} from "../../types";
import DetailCommentsScreen from "../../screens/Admin/comment/DetailCommentsScreen";
import DetailCommentClientScreen from "../../screens/Client/comment/DetailCommentClientScreen";
import ClientCommentsScreen from "../../screens/Client/ClientCommentsScreen";

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
        name="Comments"
        component={ClientCommentsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="chatbox-ellipses" color={color} />
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
        options={{
          headerTitle: "Client Detail Product Title",
          headerShown: false,
        }}
      />
      <TabClientHomeStack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ headerTitle: "Client Cart Title", headerShown: false }}
      />

<TabClientHomeStack.Screen
        name="DetailCommentClientScreen"
        component={DetailCommentClientScreen}
        options={({ route }) => ({
          comments: route.params,
          headerBackTitleVisible: false,
          headerShown: true,
        })}
      />

      {/* <TabClientHomeStack.Screen
        name="DeliveryInfo"
        component={CartScreen}
        options={{ headerTitle: "Client Cart Title", headerShown: false }}
      /> */}
      <TabClientHomeStack.Screen
        name="CheckOutScreen"
        component={CheckOutScreen}
        options={({ route }) => ({
          total: route.params.total,
          dataCart: route.params.dataCart,
          headerBackTitleVisible: false,
          headerShown: true,
        })}
      />
      <TabClientHomeStack.Screen
        name="CheckOutCashScreen"
        component={CheckOutCashScreen}
        options={({ route }) => ({
          total: route.params.total,
          dataCart: route.params.dataCart,
          headerBackTitleVisible: false,
          headerShown: true,
        })}
      />
    </TabClientHomeStack.Navigator>
  );
}

const TabClientCategoriesStack =
  createStackNavigator<TabClientCategoriesParamList>();

function ClientCommentsNavigator() {
  return (
    <TabClientCategoriesStack.Navigator>
      <TabClientCategoriesStack.Screen
        name="ClientCommentsScreen"
        component={ClientCommentsScreen}
        options={{ headerTitle: "Tab Client Categories Title" }}
      />
      <TabClientHomeStack.Screen
        name="DetailCommentClientScreenN"
        component={DetailCommentClientScreen}
        options={({ route }) => ({
          comments: route.params,
          headerBackTitleVisible: false,
          headerShown: true,
        })}
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
        options={({ route }) => ({
          // nhathuoc: route.params.nhathuoc,
          headerBackTitleVisible: false,
          title: "Client Edit Profile Screen",
          headerShown: false,
        })}
      />
      <TabClientProfileStack.Screen
        name="BuyHistoryScreen"
        component={BuyHistoryScreen}
        options={{
          title: "Buy History Screen",
        }}
      />
      <TabClientProfileStack.Screen
        name="DetailBuyHistoryScreen"
        component={DetailBuyHistoryScreen}
        options={({ route }) => ({
          madh: route.params.madh,
          headerBackTitleVisible: false,
          title: "Buy History Screen",
          headerShown: true,
        })}
      />
    </TabClientProfileStack.Navigator>
  );
}
