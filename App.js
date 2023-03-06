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
} from "react-native-iap";
import { NativeModules } from "react-native";

function hasIAP() {
  return !!NativeModules.RNIapModule;
}

function App() {
  React.useEffect(() => {
    if (!hasIAP()) return;

    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;

    initConnection().then(() => {
      console.log("init connection made");

      // we make sure that "ghost" pending payment are removed
      // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
      flushFailedPurchasesCachedAsPendingAndroid()
        .catch(() => {
          // exception can happen here if:
          // - there are pending purchases that are still pending (we can't consume a pending purchase)
          // in any case, you might not want to do anything special with the error
        })
        .then(() => {
          purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
            console.log("purchaseUpdatedListener", purchase);
            const receipt = purchase.transactionReceipt;
            if (receipt) {
              yourAPI
                .deliverOrDownloadFancyInAppPurchase(
                  purchase.transactionReceipt
                )
                .then(async (deliveryResult) => {
                  if (isSuccess(deliveryResult)) {
                    // Tell the store that you have delivered what has been paid for.
                    // Failure to do this will result in the purchase being refunded on Android and
                    // the purchase event will reappear on every relaunch of the app until you succeed
                    // in doing the below. It will also be impossible for the user to purchase consumables
                    // again until you do this.

                    // If consumable (can be purchased again)
                    await finishTransaction({ purchase, isConsumable: true });
                    // If not consumable
                    await finishTransaction({
                      purchase,
                      isConsumable: false,
                    });
                  } else {
                    // Retry / conclude the purchase is fraudulent, etc...
                  }
                });
            }
          });

          purchaseErrorSubscription = purchaseErrorListener((error) => {
            console.warn("purchaseErrorListener", error);
          });
        });
    });

    return () => {
      if (purchaseUpdateSubscription) {
        this.purchaseUpdateSubscription.remove();
        this.purchaseUpdateSubscription = null;
      }

      if (purchaseErrorSubscription) {
        this.purchaseErrorSubscription.remove();
        this.purchaseErrorSubscription = null;
      }
    };
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
