import React from 'react';
import {
  AccessibilityProps,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const colors = {
    blurple: '#635BFF',
    blurple_dark: '#5851DF',
    white: '#FFFFFF',
    light_gray: '#F6F9FC',
    dark_gray: '#425466',
    slate: '#0A2540',
  };

type Props = AccessibilityProps & {
  title?: string | React.ReactElement;
  variant?: 'default' | 'primary';
  disabled?: boolean;
  loading?: boolean;
  onPress(): void;
};

export default function Button({
  title,
  variant = 'default',
  disabled,
  loading,
  onPress,
  ...props
}: Props) {
  const titleElement = React.isValidElement(title) ? (
    title
  ) : (
    <Text style={[styles.text, variant === 'primary' && styles.textPrimary]}>
      {title}
    </Text>
  );
  return (
    <View style={disabled && styles.disabled}>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.container,
          variant === 'primary' && styles.primaryContainer,
        ]}
        onPress={onPress}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          titleElement
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryContainer: {
    backgroundColor: colors.slate,
    alignItems: 'center',
  },
  text: {
    color: colors.slate,
    fontWeight: '600',
    fontSize: 16,
  },
  textPrimary: {
    color: colors.white,
  },
  disabled: {
    opacity: 0.3,
  },
});
