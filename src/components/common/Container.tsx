import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  padding = true,
  style,
  ...props
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: padding ? 16 : 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
