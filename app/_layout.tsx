import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { AuthProvider } from "../context/authContext";
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </Provider>
  );
}