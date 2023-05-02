import { StatusBar } from "expo-status-bar";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  DrawerActions,
  useRoute,
} from "@react-navigation/native";
import { useAccount } from "@providers/AccountProvider";
import Toast from "react-native-root-toast";
import { getSubscriptions, requestSubscription } from "react-native-iap";
import { subscriptionConfig } from "@lib/config/config";
const Account = ({ route, navigation }: any) => {
  const { theme, toggleTheme } = useTheme();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const getSubs = useCallback(
    async () =>
      (await getSubscriptions({
        skus: subscriptionConfig.subscriptionSkus,
      })) as any,
    []
  );

  useEffect(() => {
    getSubs().then((subs) => {
      if (!subs || subs.length === 0) return;

      const pocketGPTSubscription = subs.filter(
        (s: any) => s.productId === subscriptionConfig.subscriptionProductId
      )[0];

      if (pocketGPTSubscription) {
        setSubscriptions(
          pocketGPTSubscription.subscriptionOfferDetails.flatMap((s: any) => {
            return s.pricingPhases.pricingPhaseList.map((p: any) => {
              return {
                name: pocketGPTSubscription.name + ` (${s.basePlanId})`,
                platform: pocketGPTSubscription.platform,
                price: p.formattedPrice,
                currencyCode: p.priceCurrencyCode,
                billingPeriod: p.billingPeriod,
                description: pocketGPTSubscription.description,
                sku: subscriptionConfig.subscriptionProductId,
                subscriptionOffers: [
                  {
                    offerToken: s.offerToken,
                    sku: subscriptionConfig.subscriptionProductId,
                    pricingPhases: s.pricingPhases,
                  },
                ],
              };
            });
          })
        );
      }
    });
  }, [getSubs]);
  const { account, authenticatedApi } = useAccount();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.palette.background,
      margin: 20,
    },

    title: {
      fontSize: 16,
      fontWeight: "400",
      color: theme.palette.text.primary,
    },
    sub: {
      fontSize: 16,
      fontWeight: "300",
      color: theme.palette.text.lightHintColor,
    },
    breaker: {
      width: "100%",
      height: 1,
      backgroundColor: theme.palette.secondary,
      marginTop: 20,
      marginBottom: 20,
    },
    box: {
      width: "100%",
      padding: 20,
      borderRadius: 5,
      marginTop: 10,
      backgroundColor: theme.palette.secondary,
    },
    button: {
      padding: 10,
      backgroundColor: theme.palette.primary,
      borderRadius: 5,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      title: "My Account",

      headerStyle: {
        backgroundColor: theme.palette.background,
      },
      headerTitleStyle: {
        color: theme.palette.text.primary,
      },
      headerTintColor: theme.palette.text.primary,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="menu" size={24} color={theme.palette.text.primary} />
        </TouchableOpacity>
      ),
    });
  }, [theme, navigation, toggleTheme]);

  const PlanBox = ({
    data: {
      billingPeriod,
      platform,
      name,
      price,
      currencyCode,
      description,
      sku,
      subscriptionOffers,
    },
  }: any) => {
    function onRequestSubscribe() {
      if (!account) return;
      requestSubscription({
        sku,
        subscriptionOffers,
        appAccountToken: account?.id,
        obfuscatedAccountIdAndroid: account?.id,
        obfuscatedProfileIdAndroid: account?.id,
      }).catch((e) => {
        console.log(e);
      });
    }
    console.log(subscriptionOffers);
    return (
      <View key={`${name}${billingPeriod}`} style={styles.box}>
        <Text
          style={{
            color: theme.palette.text.primary,
            fontSize: 20,
            fontWeight: "600",
          }}
        >
          {billingPeriod === "P1M" ? "Monthly Plan" : name}
        </Text>
        <Text
          style={{
            color: theme.palette.text.primary,
            fontSize: 16,
            fontWeight: "300",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          {"Enjoy our product at a reduced cost."}
        </Text>
        <Text
          style={{
            color: theme.palette.text.primary,
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 12,
          }}
        >
          {price} {currencyCode} {billingPeriod === "P1M" ? "/mo" : ""}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onRequestSubscribe}>
          <Text
            style={{
              color: theme.palette.text.primary,
              fontSize: 18,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            Buy Now
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: theme.palette.background, flex: 1 }}>
      <View style={{ ...styles.container, flex: 1 }}>
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.sub}>You have no active subscription</Text>
        <View style={styles.breaker} />
        <Text style={styles.title}>Plans</Text>
        <Text style={styles.sub}>Choose a plan that suits you</Text>
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <PlanBox key={`${sub.name}${sub.billingPeriod}`} data={sub} />
          ))
        ) : (
          <ActivityIndicator
            size="small"
            color={theme.palette.primary}
            style={{ marginTop: 20 }}
          />
        )}
        <StatusBar
          style={theme ? (theme.mode === "dark" ? "light" : "dark") : "auto"}
        />
      </View>
    </View>
  );
};

export default Account;
