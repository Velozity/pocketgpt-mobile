import React from "react";
import Navigator from "./components/Navigator";
import ThemeProvider from "./providers/ThemeProvider";
import AccountProvider from "./providers/AccountProvider";
import { RootSiblingParent } from "react-native-root-siblings";
import { NavigationContainer } from "@react-navigation/native";
import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
  finishTransaction,
  withIAPContext,
  getSubscriptions,
} from "react-native-iap";
import { NativeModules } from "react-native";

function hasIAP() {
  return !!NativeModules.RNIapModule;
}

function App() {
  React.useEffect(() => {
    if (!hasIAP()) {
      console.log("no iap");
      return;
    }

    initConnection().then(() => {
      console.log("init connection made");
      // we make sure that "ghost" pending payment are removed
      // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
      flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
        // exception can happen here if:
        // - there are pending purchases that are still pending (we can't consume a pending purchase)
        // in any case, you might not want to do anything special with the error
      });
    });
  }, []);

  return (
    <RootSiblingParent>
      <ThemeProvider>
        <AccountProvider>
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </AccountProvider>
      </ThemeProvider>
    </RootSiblingParent>
  );
}

export default hasIAP() ? withIAPContext(App) : App;
