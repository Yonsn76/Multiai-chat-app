import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, touchTargets } from '@/constants/design';
import { PROVIDERS } from '@/constants/providers';
import { useChatStore } from '@/stores/chatStore';

interface ChatHeaderProps {
  onOpenHistory: () => void;
  onOpenPicker: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ onOpenHistory, onOpenPicker, onNewChat }: ChatHeaderProps) {
  const { selectedProviderId, selectedModelId } = useChatStore();
  const provider = PROVIDERS[selectedProviderId];
  const model = provider.models.find((m) => m.id === selectedModelId);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onOpenHistory}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="time-outline" size={22} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.modelSelector} onPress={onOpenPicker} activeOpacity={0.7}>
        <View style={[styles.providerDot, { backgroundColor: provider.color }]} />
        <Text style={styles.modelText} numberOfLines={1}>
          {model?.name || selectedModelId}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onNewChat}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="create-outline" size={22} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  modelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    flex: 1,
    marginHorizontal: spacing.sm,
    maxWidth: 240,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  providerDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  modelText: {
    ...typography.captionBold,
    color: colors.text,
  },
});
