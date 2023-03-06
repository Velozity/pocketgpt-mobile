import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
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

const FAQ = ({ route, navigation }: any) => {
  const { theme, toggleTheme } = useTheme();

  const { account, authenticatedApi } = useAccount();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.palette.background,
    },

    title: {
      fontSize: 16,
      color: theme.palette.text.primary,
    },
    description: {
      fontSize: 14,
      color: theme.palette.text.lightHintColor,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.palette.background,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.palette.text.hintColor,
      padding: 15,
      marginBottom: 1,
      marginHorizontal: 10,
    },
    itemId: {
      fontSize: 24,
      marginRight: 10,
      color: theme.palette.text.hintColor,
    },
    itemDetails: {
      flex: 1,
    },

    details: {
      backgroundColor: theme.palette.secondary,
      overflow: "hidden",
      marginHorizontal: 10,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.palette.text.hintColor,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      title: "FAQ",

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

  const guides = [
    {
      id: "1",
      title: "What is ChatGPT?",
      description: "The fundamentals of AI technology.",
      details: () => {
        return (
          <View style={{ margin: 12 }}>
            <Text style={{ color: theme.palette.text.primary }}>
              <Text style={{ fontWeight: "bold" }}>ChatGPT</Text> is an instance
              of the GPT (Generative Pre-trained Transformer) language model
              developed by OpenAI. {"\n\n"}
              It is a large machine learning model that has been trained on a
              diverse corpus of text data to generate human-like responses to
              natural language inputs.{"\n\n"}ChatGPT can be used for a variety
              of natural language processing tasks, including text generation,
              question answering, and conversation modeling. {"\n\n"}It has been
              trained on a wide range of textual data sources, such as books,
              articles, and web pages, which allows it to generate responses on
              a wide range of topics.{"\n\n"}As a language model, ChatGPT can be
              used in various applications such as chatbots, virtual assistants,
              and automated writing assistants, among others.{"\n\n"}
              <Text
                style={{
                  color: theme.palette.text.hyperlink,
                }}
                onPress={() => {
                  Linking.openURL("https://openai.com/blog/chatgpt");
                }}
              >
                Learn more...
              </Text>
            </Text>
          </View>
        );
      },
      height: 400,
    },
    {
      id: "2",
      title: "What can ChatGPT be used for?",
      description: "Discover how AI can assist you.",
      details: () => {
        return (
          <View style={{ margin: 12 }}>
            <Text style={{ color: theme.palette.text.primary }}>
              ChatGPT can be used for a variety of natural language processing
              tasks, such as{" "}
              <Text style={{ fontWeight: "bold" }}>
                chatbots, language translation, text summarization, sentiment
                analysis, and content generation.
              </Text>
              {"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                Its flexibility and versatility make it a valuable tool for many
                different applications involving natural language.
              </Text>
              {"\n\n"}
              Examples are described in detail further down this page, however
              to list a few use cases, ChatGPT can:{"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                {
                  "\u2022 Create unique content/articles for your website or social media.\n"
                }
                {"\u2022 Explain concepts or large sums of text to you.\n"}
                {
                  "\u2022 Generate and fix code for various programming languages.\n"
                }
                {
                  "\u2022 Create imaginative scenarios to help you with job interviews.\n"
                }
                {"\u2022 Teach you how to play a game.\n"}
                {
                  "\u2022 Improve your resume or create content from it such as cover letters.\n"
                }
              </Text>
            </Text>
          </View>
        );
      },
      height: 400,
    },
    {
      id: "3",
      title: "What are the limitations?",
      description: "Learn how to make the best out of ChatGPT.",
      details: () => {
        return (
          <View style={{ margin: 12 }}>
            <Text style={{ color: theme.palette.text.primary }}>
              While ChatGPT is a powerful language model that can generate
              human-like text, there are several limitations and challenges to
              its use:{"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                {
                  "\u2022 Bias: ChatGPT can perpetuate biases and stereotypes that exist in the data it was trained on. This means that the model's responses can be discriminatory or offensive, even if unintentional.\n\n"
                }
                {
                  "\u2022 Context: ChatGPT may struggle with understanding context and nuance in language. This can result in responses that are inappropriate or irrelevant to the conversation.\n\n"
                }
                {
                  "\u2022 Accuracy: ChatGPT may generate responses that are factually incorrect or inaccurate. This is because the model generates responses based on statistical patterns in the data it was trained on, rather than a deep understanding of the underlying concepts.\n\n"
                }
                {
                  "\u2022 Fine-tuning: ChatGPT requires fine-tuning on specific tasks to achieve optimal performance. This can be time-consuming and require specialized expertise.\n\n"
                }
                {
                  "\u2022 Computational resources: ChatGPT requires significant computational resources to train and run, which can be expensive and limit its accessibility to smaller organizations or individuals.\n\n"
                }
                {
                  "\u2022 Privacy concerns: ChatGPT may raise privacy concerns if it is used to generate content that contains sensitive information, such as personal data or financial information.\n\n"
                }
              </Text>
            </Text>
          </View>
        );
      },
      height: 650,
    },
  ];

  const examples = [
    {
      id: "1",
      title: "What is ChatGPT?",
      description: "The fundamentals of AI technology.",
      details: () => {
        return (
          <View style={{ margin: 12 }}>
            <Text style={{ color: theme.palette.text.primary }}>
              <Text style={{ fontWeight: "bold" }}>ChatGPT</Text> is an instance
              of the GPT (Generative Pre-trained Transformer) language model
              developed by OpenAI. {"\n\n"}
              It is a large machine learning model that has been trained on a
              diverse corpus of text data to generate human-like responses to
              natural language inputs.{"\n\n"}ChatGPT can be used for a variety
              of natural language processing tasks, including text generation,
              question answering, and conversation modeling. {"\n\n"}It has been
              trained on a wide range of textual data sources, such as books,
              articles, and web pages, which allows it to generate responses on
              a wide range of topics.{"\n\n"}As a language model, ChatGPT can be
              used in various applications such as chatbots, virtual assistants,
              and automated writing assistants, among others.{"\n\n"}
              <Text
                style={{
                  color: theme.palette.text.hyperlink,
                }}
                onPress={() => {
                  Linking.openURL("https://openai.com/blog/chatgpt");
                }}
              >
                Learn more...
              </Text>
            </Text>
          </View>
        );
      },
      height: 400,
    },
    {
      id: "2",
      title: "What can ChatGPT be used for?",
      description: "Discover how AI can assist you.",
      details: () => {
        return (
          <View style={{ margin: 12 }}>
            <Text style={{ color: theme.palette.text.primary }}>
              ChatGPT can be used for a variety of natural language processing
              tasks, such as{" "}
              <Text style={{ fontWeight: "bold" }}>
                chatbots, language translation, text summarization, sentiment
                analysis, and content generation.
              </Text>
              {"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                Its flexibility and versatility make it a valuable tool for many
                different applications involving natural language.
              </Text>
              {"\n\n"}
              Examples are described in detail further down this page, however
              to list a few use cases, ChatGPT can:{"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                {
                  "\u2022 Create unique content/articles for your website or social media.\n"
                }
                {"\u2022 Explain concepts or large sums of text to you.\n"}
                {
                  "\u2022 Generate and fix code for various programming languages.\n"
                }
                {
                  "\u2022 Create imaginative scenarios to help you with job interviews.\n"
                }
                {"\u2022 Teach you how to play a game.\n"}
                {
                  "\u2022 Improve your resume or create content from it such as cover letters.\n"
                }
              </Text>
            </Text>
          </View>
        );
      },
      height: 400,
    },
    {
      id: "3",
      title: "What are the limitations?",
      description: "Learn how to make the best out of ChatGPT.",
      details: () => {
        return (
          <View style={{ margin: 12 }}>
            <Text style={{ color: theme.palette.text.primary }}>
              While ChatGPT is a powerful language model that can generate
              human-like text, there are several limitations and challenges to
              its use:{"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                {
                  "\u2022 Bias: ChatGPT can perpetuate biases and stereotypes that exist in the data it was trained on. This means that the model's responses can be discriminatory or offensive, even if unintentional.\n\n"
                }
                {
                  "\u2022 Context: ChatGPT may struggle with understanding context and nuance in language. This can result in responses that are inappropriate or irrelevant to the conversation.\n\n"
                }
                {
                  "\u2022 Accuracy: ChatGPT may generate responses that are factually incorrect or inaccurate. This is because the model generates responses based on statistical patterns in the data it was trained on, rather than a deep understanding of the underlying concepts.\n\n"
                }
                {
                  "\u2022 Fine-tuning: ChatGPT requires fine-tuning on specific tasks to achieve optimal performance. This can be time-consuming and require specialized expertise.\n\n"
                }
                {
                  "\u2022 Computational resources: ChatGPT requires significant computational resources to train and run, which can be expensive and limit its accessibility to smaller organizations or individuals.\n\n"
                }
                {
                  "\u2022 Privacy concerns: ChatGPT may raise privacy concerns if it is used to generate content that contains sensitive information, such as personal data or financial information.\n\n"
                }
              </Text>
            </Text>
          </View>
        );
      },
      height: 650,
    },
  ];
  const GuideList = () => {
    const [expandedId, setExpandedId] = useState(null);

    const handlePress = (id: any) => {
      setExpandedId(id === expandedId ? null : id);
    };

    const renderItem = ({ item }: any) => {
      const isExpanded = item.id === expandedId;
      const detailsMaxHeight = item.height;
      const detailsHeight = isExpanded ? detailsMaxHeight : 0;
      const detailsOpacity = isExpanded ? 1 : 0;
      const isLastItem = item.id === guides[guides.length - 1].id;

      return (
        <>
          <TouchableOpacity onPress={() => handlePress(item.id)}>
            <View
              style={{
                ...styles.item,
                ...(() => {
                  return isLastItem
                    ? {
                        borderBottomWidth: 1,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                      }
                    : {};
                })(),
              }}
            >
              <Text style={styles.itemId}>{item.id}.</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.details,
              { height: detailsHeight, opacity: detailsOpacity },
            ]}
          >
            {item.details()}
          </Animated.View>
        </>
      );
    };

    return (
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    );
  };

  return (
    <View style={{ backgroundColor: theme.palette.background, flex: 1 }}>
      <View style={{ ...styles.container, flex: 1 }}>
        <View
          style={{
            backgroundColor: theme.palette.codeHeader,
            marginHorizontal: 10,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
            marginTop: 10,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.palette.text.hintColor,
          }}
        >
          <Text
            style={{
              color: theme.palette.text.primary,
              fontSize: 16,
              paddingTop: 10,
              paddingLeft: 10,
              paddingBottom: 10,
              fontWeight: "bold",
            }}
          >
            ChatGPT FAQ
          </Text>
        </View>
        <GuideList />
        <StatusBar
          style={theme ? (theme.mode === "dark" ? "light" : "dark") : "auto"}
        />
      </View>
    </View>
  );
};

export default FAQ;
