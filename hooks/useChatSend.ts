import { useCallback } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import { PROVIDERS } from '@/constants/providers';

const EDGE_FUNCTION_URL = 'https://xldzx6ok--ai-chat-proxy.functions.blink.new';

export function useChatSend() {
  const {
    activeConversationId,
    selectedProviderId,
    selectedModelId,
    isGenerating,
    createConversation,
    addMessage,
    updateLastAssistantMessage,
    setIsGenerating,
    setStreamingContent,
    getActiveConversation,
  } = useChatStore();
  const { keys } = useApiKeyStore();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isGenerating) return;

    const apiKey = keys[selectedProviderId];
    if (!apiKey) return;

    // Create conversation if needed
    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    // Add user message
    addMessage(convId, {
      role: 'user',
      content: content.trim(),
      providerId: selectedProviderId,
      modelId: selectedModelId,
    });

    // Add placeholder assistant message
    addMessage(convId, {
      role: 'assistant',
      content: '',
      providerId: selectedProviderId,
      modelId: selectedModelId,
    });

    setIsGenerating(true);
    setStreamingContent('');

    // Build messages array from conversation
    const conversation = useChatStore.getState().conversations.find(c => c.id === convId);
    const messages = (conversation?.messages || [])
      .filter(m => m.role !== 'system' && m.content.length > 0)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProviderId,
          model: selectedModelId,
          apiKey,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        updateLastAssistantMessage(convId!, `Error: ${response.status} - ${errText}`);
        setIsGenerating(false);
        return;
      }

      // Check if streaming response
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && response.body) {
        await handleSSEStream(response.body, convId!);
      } else {
        // Non-streaming fallback
        const data = await response.json();
        updateLastAssistantMessage(convId!, data.content || 'No response');
      }
    } catch (err: any) {
      updateLastAssistantMessage(convId!, `Error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      setStreamingContent('');
    }
  }, [activeConversationId, selectedProviderId, selectedModelId, isGenerating, keys]);

  const handleSSEStream = async (body: ReadableStream, convId: string) => {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              // OpenAI-compatible format
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                setStreamingContent(accumulated);
                updateLastAssistantMessage(convId, accumulated);
              }
            } catch {
              // Might be a partial JSON, skip
            }
          }
        }
      }
    } catch (err) {
      if (accumulated.length === 0) {
        updateLastAssistantMessage(convId, 'Stream interrupted');
      }
    }
  };

  return { sendMessage, isGenerating };
}
