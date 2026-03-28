import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, touchTargets } from '@/constants/design';

interface ChatInputBarProps {
  onSend: (text: string) => void;
  isGenerating: boolean;
  hasApiKey: boolean;
}

export function ChatInputBar({ onSend, isGenerating, hasApiKey }: ChatInputBarProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || isGenerating || !hasApiKey) return;
    onSend(text.trim());
    setText('');
  };

  const canSend = text.trim().length > 0 && !isGenerating && hasApiKey;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={hasApiKey ? 'Type a message...' : 'Add an API key in Settings'}
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={10000}
          editable={hasApiKey}
          onSubmitEditing={Platform.OS === 'web' ? handleSend : undefined}
          blurOnSubmit={Platform.OS === 'web'}
        />
        <TouchableOpacity
          style={[styles.sendButton, canSend && styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons
              name="arrow-up"
              size={20}
              color={canSend ? colors.white : colors.textTertiary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.xxl,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    maxHeight: 120,
    minHeight: 36,
    paddingVertical: spacing.sm,
    paddingTop: spacing.sm,
  },
  sendButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});
