import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { PROVIDERS } from '@/constants/providers';
import type { ProviderId } from '@/types/chat';

interface ChatEmptyStateProps {
  selectedProviderId: ProviderId;
  hasApiKey: boolean;
}

export function ChatEmptyState({ selectedProviderId, hasApiKey }: ChatEmptyStateProps) {
  const provider = PROVIDERS[selectedProviderId];

  if (!hasApiKey) {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="key-outline" size={48} color={colors.textTertiary} />
        </View>
        <Text style={styles.title}>No API Key Configured</Text>
        <Text style={styles.subtitle}>
          Go to Settings to add your API key for {provider.name}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.providerCircle, { backgroundColor: provider.color + '15' }]}>
        <Ionicons
          name={provider.icon as keyof typeof Ionicons.glyphMap}
          size={36}
          color={provider.color}
        />
      </View>
      <Text style={styles.title}>Start a conversation</Text>
      <Text style={styles.subtitle}>
        Ask {provider.name} anything. Your messages are sent directly using your API key.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  providerCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
