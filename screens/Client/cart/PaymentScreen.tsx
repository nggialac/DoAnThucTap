import { initStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
// import { colors } from '../colors';
import { fetchPublishableKey } from './Helpers';

const colors = {
    blurple: '#635BFF',
    blurple_dark: '#5851DF',
    white: '#FFFFFF',
    light_gray: '#F6F9FC',
    dark_gray: '#425466',
    slate: '#0A2540',
  };

  interface Props {
    paymentMethod?: string;
  }
  
  const PaymentScreen: React.FC<Props> = ({ paymentMethod, children }) => {
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function initialize() {
        const publishableKey = await fetchPublishableKey(paymentMethod);
        if (publishableKey) {
          await initStripe({
            publishableKey,
            merchantIdentifier: 'merchant.com.stripe.react.native',
            urlScheme: 'stripe-example',
            setUrlSchemeOnAndroid: true,
          });
          setLoading(false);
        }
      }
      initialize();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return loading ? (
      <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
    ) : (
      <ScrollView
        accessibilityLabel="payment-screen"
        style={styles.container}
        keyboardShouldPersistTaps="handled">
        {children}
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{ opacity: 0 }}>appium fix</Text>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingTop: 20,
      paddingHorizontal: 16,
    },
  });
  
  export default PaymentScreen;
  