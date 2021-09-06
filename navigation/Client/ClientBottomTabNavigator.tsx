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
import CheckOutMethodScreen from "../../screens/Client/cart/CheckOutMethodScreen";
import { AuthContext } from "../../components/ContextLogin";
import { useContext } from "react";
import { LoginStackNavigator } from "..";
import BlankScreen from "../BlankScreen";

const BottomTab = createBottomTabNavigator<BottomTabClientParamList>();

export default function AdminBottomTabNavigator() {
  const colorScheme = useColorScheme();
  const context = useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;

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
  const context = useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;

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
      {nhathuoc !== null ? (
        <TabClientHomeStack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{ headerTitle: "Client Cart Title", headerShown: false }}
        />
      ) : (
        <TabClientHomeStack.Screen name="CartScreen" component={BlankScreen} />
      )}

      <TabClientHomeStack.Screen
        name="DetailCommentClientScreen"
        component={DetailCommentClientScreen}
        options={({ route }) => ({
          comments: route.params,
          headerBackTitleVisible: false,
          headerShown: true,
          headerTitle: "Comment Detail",
        })}
      />

      {/* <TabClientHomeStack.Screen
        name="DeliveryInfo"
        component={CartScreen}
        options={{ headerTitle: "Client Cart Title", headerShown: false }}
      /> */}
      <TabClientHomeStack.Screen
        name="CheckOutMethodScreen"
        component={CheckOutMethodScreen}
        options={({ route }) => ({
          total: route.params.total,
          dataCart: route.params.dataCart,
          headerBackTitleVisible: false,
          headerShown: true,
          headerTitle: "CheckOut Method",
        })}
      />

      <TabClientHomeStack.Screen
        name="CheckOutScreen"
        component={CheckOutScreen}
        options={({ route }) => ({
          total: route.params.total,
          dataCart: route.params.dataCart,
          headerBackTitleVisible: false,
          headerShown: true,
          headerTitle: "CheckOut With Stripe",
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
          headerTitle: "CheckOut With Cash",
        })}
      />
    </TabClientHomeStack.Navigator>
  );
}

const TabClientCategoriesStack =
  createStackNavigator<TabClientCategoriesParamList>();

function ClientCommentsNavigator() {
  const context = useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  return (
    <TabClientCategoriesStack.Navigator>
      {nhathuoc !== null ? (
        <TabClientCategoriesStack.Screen
          name="ClientCommentsScreen"
          component={ClientCommentsScreen}
          options={{ headerTitle: "Comments" }}
        />
      ) : (
        <TabClientCategoriesStack.Screen
          name="ClientCommentsScreen"
          component={BlankScreen}
          options={{ headerTitle: "Comments" }}
        />
      )}

      <TabClientHomeStack.Screen
        name="DetailCommentClientScreenN"
        component={DetailCommentClientScreen}
        options={({ route }) => ({
          comments: route.params,
          headerBackTitleVisible: false,
          headerShown: true,
          headerTitle: "Comment Detail",
        })}
      />
    </TabClientCategoriesStack.Navigator>
  );
}

const TabClientProfileStack = createStackNavigator<TabClientProfileParamList>();

function ClientTabProfileNavigator({ navigation }) {
  const { colors } = useTheme();
  const context = useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;

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
          headerTitle: "Profile",
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
      {nhathuoc !== null ? (
        <TabClientProfileStack.Screen
          name="ClientEditProfileScreen"
          component={ClientEditProfileScreen}
          options={({ route }) => ({
            // nhathuoc: route.params.nhathuoc,
            headerBackTitleVisible: false,
            title: "Edit Profile",
            headerShown: false,
          })}
        />
      ) : (
        <TabClientProfileStack.Screen
          name="ClientEditProfileScreen"
          component={BlankScreen}
        />
      )}
      <TabClientProfileStack.Screen
        name="BuyHistoryScreen"
        component={BuyHistoryScreen}
        options={{
          title: "Buy History List",
        }}
      />
      <TabClientProfileStack.Screen
        name="DetailBuyHistoryScreen"
        component={DetailBuyHistoryScreen}
        options={({ route }) => ({
          madh: route.params.madh,
          headerBackTitleVisible: false,
          title: "Buy History Detail",
          headerShown: true,
        })}
      />
      {/* <TabClientProfileStack.Screen
        name="SplashScreen"
        component={LoginStackNavigator}
        options={{
          // title: "Buy History List",
          headerShown: false,
        }}
      /> */}
    </TabClientProfileStack.Navigator>
  );
}
