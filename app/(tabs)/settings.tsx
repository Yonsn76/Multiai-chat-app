import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/design';
import { PROVIDERS, PROVIDER_IDS } from '@/constants/providers';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import type { ProviderId } from '@/types/chat';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [expandedProvider, setExpandedProvider] = useState<ProviderId | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your API keys</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {PROVIDER_IDS.map((providerId) => (
          <ProviderKeyCard
            key={providerId}
            providerId={providerId}
            isExpanded={expandedProvider === providerId}
            onToggle={() =>
              setExpandedProvider(expandedProvider === providerId ? null : providerId)
            }
          />
        ))}

        <View style={styles.footerNote}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.textTertiary} />
          <Text style={styles.footerText}>
            Keys are stored locally on your device and sent directly to providers.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

interface ProviderKeyCardProps {
  providerId: ProviderId;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProviderKeyCard({ providerId, isExpanded, onToggle }: ProviderKeyCardProps) {
  const provider = PROVIDERS[providerId];
  const { keys, setApiKey, removeApiKey, hasApiKey } = useApiKeyStore();
  const [inputValue, setInputValue] = useState(keys[providerId] || '');
  const isConfigured = hasApiKey(providerId);

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(providerId, inputValue.trim());
    }
  };

  const handleRemove = () => {
    removeApiKey(providerId);
    setInputValue('');
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconCircle, { backgroundColor: provider.color + '20' }]}>
            <Ionicons
              name={provider.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={provider.color}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.modelCount}>
              {provider.models.length} model{provider.models.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          {isConfigured && (
            <View style={styles.configuredBadge}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            </View>
          )}
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textTertiary}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.cardBody}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.apiKeyInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={provider.placeholder}
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
              disabled={!inputValue.trim()}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark" size={16} color={colors.white} />
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            {isConfigured && (
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={handleRemove}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color={colors.error} />
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: touchTargets.comfortable,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    gap: 2,
  },
  providerName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  modelCount: {
    ...typography.small,
    color: colors.textTertiary,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  configuredBadge: {
    marginRight: spacing.xs,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiKeyInput: {
    flex: 1,
    ...typography.caption,
    color: colors.text,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: touchTargets.minimum,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minHeight: 36,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveText: {
    ...typography.captionBold,
    color: colors.white,
  },
  removeButton: {
    backgroundColor: colors.errorTint,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  removeText: {
    ...typography.captionBold,
    color: colors.error,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  footerText: {
    ...typography.small,
    color: colors.textTertiary,
    flex: 1,
  },
});
