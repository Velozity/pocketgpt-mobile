import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { useTheme } from "@providers/ThemeProvider";
import { useAccount } from "@providers/AccountProvider";
import { parseIsoTimestampToChatTime } from "@utils/parsers";
import { useIsFocused } from "@react-navigation/native";
const Home = () => {
  const { theme } = useTheme();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account, authenticatedApi } = useAccount();
  const isFocused = useIsFocused();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  function retrieveChats() {
    if (!account) return;
    authenticatedApi
      ?.retrieveChats()
      .then((chats: any) => {
        setChats(chats);
        setLoading(false);
      })
      .catch((error: any) => {
        console.error("Error retrieving chats:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (isFocused) {
      retrieveChats();
    }
  }, [isFocused]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.palette.background,
    },
    button: {
      backgroundColor: "red",
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    buttonText: {
      color: theme.palette.text.primary,
      fontWeight: "bold",
      fontSize: 16,
    },
    createChatText: {
      flexDirection: "row",
      marginTop: 10,
    },
  });

  const handleDeleteSelected = () => {
    const remainingChats = chats.filter(
      (chat: any) => !selectedItems.includes(chat.id)
    );
    setChats(remainingChats);

    authenticatedApi?.deleteChats(selectedItems).catch((err) => {
      console.log(err);
      Toast.show("Failed to delete chats.");
    });
    setSelectedItems([]);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Home",

      headerStyle: {
        backgroundColor: theme.palette.background,
      },
      headerTitleStyle: {
        color: theme.palette.text.primary,
      },
      headerTintColor: theme.palette.text.primary,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="menu" size={24} color={theme.palette.text.primary} />
        </TouchableOpacity>
      ),
      headerRight: () =>
        selectedItems.length === 0 ? (
          <TouchableOpacity
            onPress={() => {
              const findEmptyChat: any = chats.find(
                (c: any) => c.Message === null
              );
              if (findEmptyChat) {
                navigation.navigate("Chat", {
                  chatId: findEmptyChat.id,
                  title: findEmptyChat.title,
                });
                return;
              }

              authenticatedApi?.createChat().then((res: any) => {
                if (res.error) {
                  Toast.show(res.error);
                  return;
                }

                if (res.success) {
                  retrieveChats();

                  navigation.navigate("Chat", {
                    chatId: res.chat.id,
                    title: "New chat",
                  });
                }
              });
            }}
            style={{ marginRight: 20 }}
          >
            <Ionicons name="add" size={24} color={theme.palette.text.primary} />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              marginRight: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.palette.text.primary,
                fontSize: 16,
                marginRight: 10,
              }}
            >
              {selectedItems.length} chats selected
            </Text>
            <TouchableOpacity onPress={handleDeleteSelected}>
              <Ionicons
                name="trash"
                size={24}
                color={theme.palette.text.primary}
              />
            </TouchableOpacity>
          </View>
        ),
    });
  }, [chats, selectedItems, theme, navigation]);

  async function deleteChats(chatIds: string[]) {
    authenticatedApi?.deleteChats(chatIds).then((res: any) => {
      retrieveChats();
    });
  }

  const handleSignOut = () => {
    console.log("Sign out button pressed");
    // Call the logout function to sign out the user
  };

  const ChatList = ({ chats, onChatDelete }: any) => {
    const styles = StyleSheet.create({
      chatContainer: {
        flexDirection: "row",

        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 20,
        width: "100%",
      },
      chatTextContainer: {
        flex: 1,
      },
      chatTitle: {
        fontSize: 16,

        color: theme.palette.text.primary,
      },
      chatPreview: {
        fontSize: 14,
        color: theme.palette.text.lightHintColor,
      },
      chatTimestampContainer: {
        marginLeft: 16,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      },
      chatTimestamp: {
        fontSize: 12,
        color: theme.palette.text.lightHintColor,
      },
      itemCheckbox: {
        marginTop: 6,

        width: 20,
        height: 20,
        marginRight: 10,
        borderColor: theme.palette.text.lightHintColor,

        borderWidth: 1,
        borderRadius: 2,
      },
      deleteButtonContainer: {
        position: "absolute",
        top: 10,
        right: 10,
      },
      deleteButton: {
        padding: 10,
        borderRadius: 10,
      },
      deleteButtonText: {
        color: theme.palette.text.primary,
      },
    });

    const renderChat = ({ item }: any) => {
      const { title, Message, createdAt, id } = item;

      const handleCheckboxPress = () => {
        if (selectedItems.includes(id)) {
          setSelectedItems(selectedItems.filter((id2) => id !== id2));
        } else {
          setSelectedItems([...selectedItems, id]);
        }
      };

      const isSelected = selectedItems.includes(id);

      return (
        <TouchableOpacity
          onPress={() => {
            if (selectedItems.length > 0) {
              handleCheckboxPress();
            } else {
              navigation.navigate("Chat", { chatId: id, title });
            }
          }}
          onLongPress={handleCheckboxPress}
        >
          <View style={styles.chatContainer}>
            {selectedItems.length > 0 ? (
              <TouchableOpacity
                style={styles.itemCheckbox}
                onPress={handleCheckboxPress}
              >
                <Text
                  style={{
                    color: theme.palette.text.primary,

                    fontWeight: "bold",
                  }}
                >
                  {isSelected ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={theme.palette.text.primary}
                    />
                  ) : null}
                </Text>
              </TouchableOpacity>
            ) : null}
            <View style={styles.chatTextContainer}>
              <Text style={styles.chatTitle}>{title ?? "Untitled Chat"}</Text>
              <Text style={styles.chatPreview} numberOfLines={1}>
                {Message ? Message.text.substring(0, 100) : "Start Chatting..."}
              </Text>
            </View>
            <View style={styles.chatTimestampContainer}>
              <Text style={styles.chatTimestamp}>
                {parseIsoTimestampToChatTime(
                  Message ? Message.createdAt : createdAt
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <FlatList
        data={chats}
        renderItem={renderChat}
        ref={flatListRef}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={() => {
          retrieveChats();
        }}
        refreshing={false}
      />
    );
  };

  return (
    <View style={{ backgroundColor: theme.palette.background, flex: 1 }}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={theme.palette.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <ChatList chats={chats} onChatDelete={deleteChats} />
        )}
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: theme.palette.text.lightHintColor,
              fontSize: 13,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            Press{" "}
            <Text style={{ color: theme.palette.text.lightHintColor }}>+</Text>{" "}
            to start a{" "}
            <Text style={{ color: theme.palette.primary }}>new chat</Text>
          </Text>
        </View>
        <StatusBar
          style={theme ? (theme.mode === "dark" ? "light" : "dark") : "auto"}
        />
      </View>
    </View>
  );
};

export default Home;
