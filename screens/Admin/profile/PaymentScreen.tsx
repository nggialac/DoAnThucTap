// App.ts
import { StripeProvider } from '@stripe/stripe-react-native';

const publishableKey = "pk_test_51JMwUxHt334vnxQRVExqstbHrMkJHwH6M38wGLXyXXZGV5baUMwX0esXFLVacJ8A3LkYzQVRJ006xw20VtTZl34h00MHxJtJQG";

function App() {
  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier"
    >
      <PaymentScreen />
    </StripeProvider>
  );
}

// PaymentScreen.ts
import { CardField, useStripe } from '@stripe/stripe-react-native';

export default function PaymentScreen() {
  const { confirmPayment } = useStripe();

  return (
    <CardField
      postalCodeEnabled={true}
      placeholder={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('cardDetails', cardDetails);
      }}
      onFocus={(focusedField) => {
        console.log('focusField', focusedField);
      }}
    />
  );
}