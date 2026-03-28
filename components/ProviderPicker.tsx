import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, touchTargets } from '@/constants/design';
import { PROVIDERS, PROVIDER_IDS } from '@/constants/providers';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import { useChatStore } from '@/stores/chatStore';
import type { ProviderId } from '@/types/chat';

interface ProviderPickerProps {
  visible: boolean;
  onClose: () => void;
}

export function ProviderPicker({ visible, onClose }: ProviderPickerProps) {
  const { hasApiKey } = useApiKeyStore();
  const { selectedProviderId, selectedModelId, setSelectedProvider, setSelectedModel } = useChatStore();
  const [expandedProvider, setExpandedProvider] = useState<ProviderId | null>(selectedProviderId);

  const configuredProviders = PROVIDER_IDS.filter((id) => hasApiKey(id));

  const handleSelectModel = (providerId: ProviderId, modelId: string) => {
    setSelectedProvider(providerId);
    setSelectedModel(modelId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select Model</Text>

          {configuredProviders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="key-outline" size={40} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No API keys configured</Text>
              <Text style={styles.emptySubtext}>Add keys in Settings to get started</Text>
            </View>
          ) : (
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {configuredProviders.map((providerId) => {
                const provider = PROVIDERS[providerId];
                const isExpanded = expandedProvider === providerId;

                return (
                  <View key={providerId} style={styles.providerSection}>
                    <TouchableOpacity
                      style={styles.providerRow}
                      onPress={() => setExpandedProvider(isExpanded ? null : providerId)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.providerInfo}>
                        <View style={[styles.iconCircle, { backgroundColor: provider.color + '20' }]}>
                          <Ionicons
                            name={provider.icon as keyof typeof Ionicons.glyphMap}
                            size={18}
                            color={provider.color}
                          />
                        </View>
                        <Text style={styles.providerName}>{provider.name}</Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={colors.textTertiary}
                      />
                    </TouchableOpacity>

                    {isExpanded && provider.models.map((model) => {
                      const isSelected = selectedProviderId === providerId && selectedModelId === model.id;
                      return (
                        <TouchableOpacity
                          key={model.id}
                          style={[styles.modelRow, isSelected && styles.modelRowSelected]}
                          onPress={() => handleSelectModel(providerId, model.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.modelName, isSelected && styles.modelNameSelected]}>
                            {model.name}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
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
    maxHeight: '70%',
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
  providerSection: {
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: touchTargets.minimum,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.xl + spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: touchTargets.minimum,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modelRowSelected: {
    backgroundColor: colors.primaryTint,
  },
  modelName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  modelNameSelected: {
    color: colors.primary,
    fontWeight: '600',
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
