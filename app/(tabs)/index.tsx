import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/design';
import { useChatStore } from '@/stores/chatStore';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import { useChatSend } from '@/hooks/useChatSend';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInputBar } from '@/components/ChatInputBar';
import { ChatEmptyState } from '@/components/ChatEmptyState';
import { ProviderPicker } from '@/components/ProviderPicker';
import { ConversationList } from '@/components/ConversationList';
import type { ChatMessage } from '@/types/chat';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { selectedProviderId, isGenerating, setActiveConversation, getActiveConversation } = useChatStore();
  const { hasApiKey } = useApiKeyStore();
  const { sendMessage } = useChatSend();

  const conversation = getActiveConversation();
  const messages = conversation?.messages || [];
  const hasKey = hasApiKey(selectedProviderId);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, messages[messages.length - 1]?.content]);

  const handleNewChat = () => {
    setActiveConversation(null);
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isLastAssistant = item.role === 'assistant' && index === messages.length - 1;
    return (
      <ChatBubble
        message={item}
        isStreaming={isLastAssistant && isGenerating}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ChatHeader
          onOpenHistory={() => setShowHistory(true)}
          onOpenPicker={() => setShowPicker(true)}
          onNewChat={handleNewChat}
        />

        {messages.length === 0 ? (
          <ChatEmptyState
            selectedProviderId={selectedProviderId}
            hasApiKey={hasKey}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />
        )}

        <View style={{ paddingBottom: insets.bottom > 0 ? 0 : spacing.xs }}>
          <ChatInputBar
            onSend={sendMessage}
            isGenerating={isGenerating}
            hasApiKey={hasKey}
          />
        </View>

        <ProviderPicker visible={showPicker} onClose={() => setShowPicker(false)} />
        <ConversationList visible={showHistory} onClose={() => setShowHistory(false)} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
  },
});
