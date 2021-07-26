import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { useState, useMemo, useEffect } from "react";
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState("");

  const authContext = useMemo(
    () => ({
      signIn: () => {
        setUserToken("lacnguyen");
        setIsLoading(false);
      },
      signOut: () => {
        setUserToken("");
        setIsLoading(false);
      },
      signUp: () => {
        setUserToken("lacnguyen");
        setIsLoading(false);
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);


  if (!isLoadingComplete || isLoading) {
    // return null;
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
