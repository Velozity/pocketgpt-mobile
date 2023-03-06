import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useTheme } from "@providers/ThemeProvider";
import { useAccount } from "@providers/AccountProvider";
import { parseIsoTimestampToChatTime } from "@utils/parsers";
import { NavigationProp, Route } from "@react-navigation/native";
import ChatMessagesList from "@components/ChatMessagesList";
import { FontAwesome5 } from "@expo/vector-icons";

const Chat = ({ route, navigation }: any) => {
  const { chatId, title: initialTitle } = route.params;
  const [title, setTitle] = useState(initialTitle);
  const { theme } = useTheme();
  const [chat, setChat] = useState<{
    id?: string;
    createdAt?: string;
    title?: string;
  }>({});
  const [messages, setMessages] = useState<any>([]);
  const [page, setPage] = useState(1);
  const { account, authenticatedApi } = useAccount();

  useEffect(() => {
    authenticatedApi?.retrieveMessages(chatId, 1).then((res) => {
      const { Message, createdAt, id, title } = res;
      setMessages(Message || []);
      setChat({ createdAt, id, title });
    });
  }, []);

  const [loadingNext, setLoadingNext] = useState(false);
  async function onPullDownRefresh() {
    if (messages[messages.length - 1].type === "convoStart") return;
    if (loadingNext) return;
    setLoadingNext(true);
    const res = await authenticatedApi
      ?.retrieveMessages(chatId, page + 1)
      .catch((e) => e);
    if (!res) {
      setLoadingNext(false);
      return;
    }
    const { Message } = res;
    setMessages((old: any) => {
      return [...old, ...(Message || [])];
    });
    setPage(page + 1);
    setLoadingNext(false);
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.palette.background,

      flex: 1,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.palette.background,
      padding: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary,
      borderRadius: 20,
      paddingLeft: 16,
      paddingRight: 40,
      paddingTop: 9,
      paddingBottom: 9,
      marginRight: 10,
    },
    button: {
      backgroundColor: theme.palette.text.primary,
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    sendButton: {
      backgroundColor: theme.palette.primary,
      borderRadius: 50,
      padding: 10,
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

  useEffect(() => {
    navigation.setOptions({
      title: chat.title ?? title ?? "Untitled Chat",

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
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            style={{ marginLeft: 10 }}
            color={theme.palette.text.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [title, chat, theme, navigation]);

  const typeWrite: any = (text: string, delay: number, set: any) => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        if (currentIndex === 0) {
          set(text[currentIndex]);
        } else {
          set((prevText: string) => prevText + text[currentIndex]);
        }
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);
  };

  const [text, setText] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const handleSend = () => {
    setWaitingForResponse(true);
    const userMsg = {
      isHuman: true,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((old: any) => [userMsg, ...old]);

    authenticatedApi
      ?.sendMessage(chat.id || chatId, text, (msg: string, index: number) => {
        if (index === 1) {
          const newMsg = {
            typing: true,
            isHuman: false,
            text: msg,
          };

          setMessages((old: any) => [newMsg, ...old]);
        } else {
          setMessages((old: any) => {
            const oldMsg = old.shift();
            if (oldMsg.isHuman) return [oldMsg, ...old];

            oldMsg.text = oldMsg.text + msg;
            return [oldMsg, ...old];
          });
        }
      })
      .then((fullResponse) => {
        console.log("full response:");
        console.log(fullResponse);
        const { text, title, createdAt } = fullResponse;
        if (title) {
          typeWrite(title, 50, setTitle);
        }

        setMessages((old: any) => {
          const msg = old.shift();
          if (msg.isHuman) return [msg, ...old];

          msg.text = text;
          msg.createdAt = createdAt;
          msg.typing = false;
          msg.createdAt = new Date().toISOString();
          return [msg, ...old];
        });
        setWaitingForResponse(false);
      })
      .catch(() => {
        setWaitingForResponse(false);
      });
    setText("");
  };

  return (
    <View style={{ backgroundColor: theme.palette.background, flex: 1 }}>
      <View style={styles.container}>
        {messages?.length === 0 ? (
          <ActivityIndicator
            size="small"
            color={theme.palette.primary}
            style={{ marginTop: 20, flex: 1 }}
          />
        ) : (
          <ChatMessagesList
            messages={messages}
            onPullDownRefresh={onPullDownRefresh}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            multiline={true}
            placeholder="Type a message..."
            placeholderTextColor={theme.palette.text.hintColor}
            editable={!waitingForResponse}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={waitingForResponse}
          >
            <Ionicons name="send" size={24} color={"#FFF"} />
          </TouchableOpacity>
        </View>
        <StatusBar
          style={theme ? (theme.mode === "dark" ? "light" : "dark") : "auto"}
        />
      </View>
    </View>
  );
};

export default Chat;
