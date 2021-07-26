import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../../screens/Login/SignInScreen";
import SignOutScreen from "../../screens/Login/SignOutScreen";
import SignUpScreen from "../../screens/Login/SignUpScreen";
import { LoginParamList } from "../../types";
import * as React from "react";

const LoginStack = createStackNavigator();

function LoginNavigator() {
  return (
    <LoginStack.Navigator headerMode="none">
      <LoginStack.Screen name="SignInScreen" component={SignInScreen} />
      <LoginStack.Screen name="SignOutScreen" component={SignOutScreen} />
      <LoginStack.Screen name="SignUpScreen" component={SignUpScreen} />
    </LoginStack.Navigator>
  );
}
export default LoginNavigator;
