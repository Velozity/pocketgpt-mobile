import { useTheme } from "@providers/ThemeProvider";
import {
  parseChatMessageTimestamp,
  parseIsoTimestampToChatTime,
} from "@utils/parsers";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import InvertedFlatList from "react-native-inverted-flat-list";

export default function ChatMessagesList({
  messages,
  onPullDownRefresh,
}: {
  messages: any[];
  onPullDownRefresh: () => Promise<void>;
}) {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const styles = StyleSheet.create({
    messagesContainer: {
      width: "100%",
      paddingTop: 16,
      paddingBottom: 8,
    },
    chatBubbleContainer: {
      maxWidth: "80%",
      padding: 8,
      borderRadius: 12,
      marginHorizontal: 10,
      marginTop: 8,
      paddingHorizontal: 10,
      marginBottom: 8,
    },
    outgoingChatBubbleContainer: {
      backgroundColor: theme.palette.primary,
      alignSelf: "flex-end",
    },
    incomingChatBubbleContainer: {
      alignSelf: "flex-start",
      backgroundColor: theme.palette.secondary,
    },
    chatBubbleText: {
      color: theme.palette.text.primary,
      fontSize: 16,
    },
    outgoingChatBubbleText: {
      color: theme.palette.text.primary,
    },
    incomingChatBubbleText: {
      color: theme.palette.text.primary,
    },
    chatBubbleTimestamp: {
      fontSize: 12,
      alignSelf: "flex-end",
      marginTop: 2,
    },
    outgoingChatBubbleTimestamp: {
      color: theme.palette.text.secondary,
    },
    incomingChatBubbleTimestamp: {
      color: theme.palette.text.hintColor,
    },
  });

  const ChatBubble = ({ message, isHuman }: any) => {
    if (message.type === "convoStart") {
      return (
        <View>
          <Text
            style={{ textAlign: "center", color: theme.palette.text.hintColor }}
          >
            Conversation started{" "}
            {parseIsoTimestampToChatTime(message.createdAt)}
          </Text>
        </View>
      );
    }

    const containerStyle = [
      styles.chatBubbleContainer,
      isHuman
        ? styles.outgoingChatBubbleContainer
        : styles.incomingChatBubbleContainer,
    ];

    const textStyle = [
      styles.chatBubbleText,
      isHuman ? styles.outgoingChatBubbleText : styles.incomingChatBubbleText,
    ];

    const timestampStyle = [
      styles.chatBubbleTimestamp,
      isHuman
        ? styles.outgoingChatBubbleTimestamp
        : styles.incomingChatBubbleTimestamp,
    ];

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>{message.text}</Text>
        {message.typing ? (
          <View style={{ margin: 8 }} />
        ) : (
          <Text style={timestampStyle}>
            {parseChatMessageTimestamp(message.createdAt)}
          </Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    return <ChatBubble message={item} isHuman={item.isHuman} />;
  };

  return (
    <InvertedFlatList
      data={messages}
      refreshing={refreshing}
      onPullToRefresh={() => {
        setRefreshing(true);
        onPullDownRefresh().then(() => {
          setRefreshing(false);
        });
      }}
      keyExtractor={(item: any, index: any) => index.toString()}
      renderItem={renderItem}
      inverted
    />
  );
}
