import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { PROVIDERS } from '@/constants/providers';
import type { ChatMessage } from '@/types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function ChatBubble({ message, isStreaming = false }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const provider = message.providerId ? PROVIDERS[message.providerId] : null;

  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerAssistant]}>
      {!isUser && provider && (
        <View style={styles.providerBadge}>
          <Ionicons
            name={provider.icon as keyof typeof Ionicons.glyphMap}
            size={12}
            color={provider.color}
          />
          <Text style={styles.providerName}>
            {message.modelId ? PROVIDERS[message.providerId!].models.find(m => m.id === message.modelId)?.name || message.modelId : provider.name}
          </Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.messageText, isUser ? styles.textUser : styles.textAssistant]}>
          {message.content}
          {isStreaming && <Text style={styles.cursor}>▊</Text>}
        </Text>
      </View>
      {!isStreaming && (
        <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAssistant]}>
          {formatTime(message.timestamp)}
        </Text>
      )}
    </View>
  );
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    maxWidth: '85%',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  containerAssistant: {
    alignSelf: 'flex-start',
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  providerName: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.xl,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.xs,
  },
  bubbleAssistant: {
    backgroundColor: colors.backgroundTertiary,
    borderBottomLeftRadius: borderRadius.xs,
  },
  messageText: {
    ...typography.body,
    lineHeight: 22,
  },
  textUser: {
    color: colors.white,
  },
  textAssistant: {
    color: colors.text,
  },
  cursor: {
    color: colors.primary,
    opacity: 0.7,
  },
  timestamp: {
    ...typography.tiny,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  timestampUser: {
    textAlign: 'right',
  },
  timestampAssistant: {
    textAlign: 'left',
  },
});
