/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import { LoginStackParamList, RootStackParamList } from "../types";
import AdminBottomTabNavigator from "./Admin/AdminBootTabNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import ClientBottomTabNavigator from "./Client/ClientBottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

// import LoginNavigator from "./Login/LoginNavigator";
import SplashScreen from "../screens/Login/SplashScreen";
import SignInScreen from "../screens/Login/SignInScreen";
import SignOutScreen from "../screens/Login/SignOutScreen";
import SignUpScreen from "../screens/Login/SignUpScreen";
import ClientSignUpScreen from "../screens/Login/ClientSignUpScreen";
import ForgetPassScreen from "../screens/Login/ForgetPassScreen";

import { AuthContext } from "../components/ContextLogin";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper";

import { getStaffByUsername } from "../api/StaffApi";
import { getNtByUsername } from "../api/NTApis";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    role: null,
    userToken: null,
    mnv_mnt: null,
  };

  const CustomDefaultTheme = {
    ...DefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: "#ffffff",
      text: "#333333",
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: "#333333",
      text: "#ffffff",
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState: any, action: any) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userName: action.id,
          role: action.quyen,
          userToken: action.token,
          mnv_mnt: action.ma,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          role: action.quyen,
          userToken: action.token,
          mnv_mnt: action.ma,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          role: null,
          userToken: null,
          mnv_mnt: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userName: action.id,
          role: action.quyen,
          userToken: action.token,
          mnv_mnt: action.ma,
          isLoading: false,
        };
      default:
        return prevState;
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  // const { signIn } = React.useContext(AuthContext);
  const callNt = async (username) => {
    let temp;
    await getNtByUsername(username)
      .then((res) => {
        console.log(res.data);
        temp = res.data;
      })
      .catch((e) => {
        console.log(e);
      });
    return temp;
  };
  const callNv = async (username) => {
    let temp;
    await getStaffByUsername(username)
      .then((res) => {
        console.log(res.data);
        temp = res.data;
      })
      .catch((e) => {
        console.log(e);
      });
    return temp;
  };

  const check = async (role: any, userName: any) => {
    var mnv_mnt;
    if (role === "3") {
      mnv_mnt = await callNv(userName);
    } else if (role === "2") {
      mnv_mnt = await callNt(userName);
    }
    return mnv_mnt;
  };

  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser: any) => {
        // setUserToken("lacnguyen");
        // setIsLoading(false);
        const userToken = String(foundUser[0].userToken);
        const role = String(foundUser[0].quyen.maquyen);
        const userName = String(foundUser[0].username);

        // if (role === "3") {
        //   mnv_mnt = await callNv(userName);
        // }
        // else if (role === "2"){
        //   mnv_mnt = await callNt(userName);
        // }
        // const mnv_mnt = ;
        //  console.log("MNV_MNT: " + mnv_mnt);
        // // return mnv_mnt;

        // try {
        //   await AsyncStorage.setItem("userToken", userToken);
        //   await AsyncStorage.setItem("userName", userName);
        //   await AsyncStorage.setItem("role", role);
        //   await AsyncStorage.setItem("MNV_MNT", JSON.stringify(mnv_mnt));
        // } catch (e) {
        //   console.log(e);
        // }

        dispatch({
          type: "LOGIN",
          id: userName,
          quyen: role,
          ma: await check(role, userName),
          token: userToken,
        });
      },
      signOut: async () => {
        // setUserToken(null);
        // setIsLoading(false);
        // try {
        //   await AsyncStorage.removeItem("userToken");
        //   await AsyncStorage.removeItem("userName");
        //   await AsyncStorage.removeItem("role");
        //   await AsyncStorage.removeItem("MNV_MNT");
        // } catch (e) {
        //   console.log(e);
        // }
        dispatch({ type: "LOGOUT" });
      },
      signUp: () => {
        // setUserToken("lacnguyen");
        // setIsLoading(false);
      },
      toggleTheme: () => {
        setIsDarkTheme((isDarkTheme) => !isDarkTheme);
      },
      // getContext: loginState.mnv_mnt
    }),
    []
  );

  React.useEffect(() => {
    // setTimeout(async () => {
    //   // setIsLoading(false);
    //   let userToken = null;
    //   let userName = null;
    //   let role = null;
    //   let ma = null;
    //   try {
    //     userToken = await AsyncStorage.getItem("userToken");
    //     userName = await AsyncStorage.getItem("userName");
    //     role = await AsyncStorage.getItem("role");
    //     ma = await AsyncStorage.getItem("MNV_MNT");
    //   } catch (e) {
    //     console.log(e);
    //   }
    //   dispatch({
    //     type: "RETRIEVE_TOKEN",
    //     token: userToken,
    //     id: userName,
    //     quyen: role,
    //     ma: ma,
    //   });
    //   //  dispatch({ type: "RETRIEVE_TOKEN", id: "user", token: "lacnguyen" });
    // }, 2000);
  }, []);

  // if (loginState.isLoading) {
  //   // return null;
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // } else {
  return (
    <AuthContext.Provider value={{ authContext, loginState }}>
      <NavigationContainer
        linking={LinkingConfiguration}
        // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        theme={theme}
      >
        {/* {console.log(loginState.userName)} */}
        {/* {console.log(authContext)} */}
        {console.log(loginState.role)}
        {/* {console.log(loginState.mnv_mnt)} */}
        {loginState.mnv_mnt !== null ? (
          // <RootNavigator role={loginState.role}/>
          loginState.role === "1" ? (
            <AdminBottomTabNavigator />
          ) : (
            <ClientBottomTabNavigator />
          )
        ) : (
          // <AdminBottomTabNavigator/>
          <LoginStackNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
// }

// const Stack = createStackNavigator<RootStackParamList>();

// function RootNavigator(props) {
//   return (
//     // <Stack.Group></Stack.Group>
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {/* <Stack.Screen name="Root" component={BottomTabNavigator} /> */}
//       {/* <Stack.Screen name="Login" component={LoginNavigator} /> */}
//       {console.log(props.role)}
//       { props.role === 1 ? <Stack.Screen name="Admin" component={AdminBottomTabNavigator} /> : <Stack.Screen name="Client" component={ClientBottomTabNavigator} />}
//       {/* <Stack.Screen name="Admin" component={AdminBottomTabNavigator} /> */}
//       {/* <Stack.Screen name="Client" component={ClientBottomTabNavigator} /> */}
//       {/* <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} /> */}
//     </Stack.Navigator>
//   );
// }

const LoginStack = createStackNavigator<LoginStackParamList>();

function LoginStackNavigator() {
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }}>
      <LoginStack.Screen name="SplashScreen" component={SplashScreen} />
      <LoginStack.Screen name="SignInScreen" component={SignInScreen} />
      <LoginStack.Screen name="SignOutScreen" component={SignOutScreen} />
      <LoginStack.Screen name="SignUpScreen" component={SignUpScreen} />
      <LoginStack.Screen
        name="ForgetPasswordScreen"
        component={ForgetPassScreen}
      />
      <LoginStack.Screen
        name="ClientSignUpScreen"
        component={ClientSignUpScreen}
      />
    </LoginStack.Navigator>
  );
}
