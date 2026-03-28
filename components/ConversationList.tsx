import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, touchTargets } from '@/constants/design';
import { PROVIDERS } from '@/constants/providers';
import { useChatStore } from '@/stores/chatStore';
import type { Conversation } from '@/types/chat';

interface ConversationListProps {
  visible: boolean;
  onClose: () => void;
}

export function ConversationList({ visible, onClose }: ConversationListProps) {
  const { conversations, activeConversationId, setActiveConversation, deleteConversation } = useChatStore();

  const handleSelect = (id: string) => {
    setActiveConversation(id);
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteConversation(id);
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const provider = PROVIDERS[item.providerId];
    const isActive = item.id === activeConversationId;
    const lastMessage = item.messages[item.messages.length - 1];
    const preview = lastMessage?.content?.slice(0, 60) || 'No messages yet';

    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.itemActive]}
        onPress={() => handleSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleRow}>
              <Ionicons
                name={provider.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={provider.color}
              />
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.itemTime}>{formatRelativeTime(item.updatedAt)}</Text>
          </View>
          <Text style={styles.itemPreview} numberOfLines={1}>
            {preview}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Conversations</Text>

          {conversations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={40} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>Start a new chat to begin</Text>
            </View>
          ) : (
            <FlatList
              data={conversations}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    maxHeight: '75%',
    paddingBottom: spacing.xxl,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.textTertiary,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: touchTargets.minimum,
  },
  itemActive: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  itemContent: {
    flex: 1,
    gap: spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.sm,
  },
  itemTitle: {
    ...typography.captionBold,
    color: colors.text,
    flex: 1,
  },
  itemTime: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  itemPreview: {
    ...typography.small,
    color: colors.textTertiary,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
