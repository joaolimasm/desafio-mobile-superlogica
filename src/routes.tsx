import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./views/Home";

const Stack = createNativeStackNavigator();

const MainRoute = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

export default MainRoute;
