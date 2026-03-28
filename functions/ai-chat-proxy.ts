const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  provider: string;
  model: string;
  apiKey: string;
  messages: ChatMessage[];
  stream?: boolean;
}

// Provider endpoint configs
const PROVIDER_CONFIGS: Record<string, { baseUrl: string; getHeaders: (apiKey: string) => Record<string, string>; transformBody: (model: string, messages: ChatMessage[], stream: boolean) => unknown; extractContent: (data: unknown) => string }> = {
  openai: {
    baseUrl: "https://api.openai.com/v1/chat/completions",
    getHeaders: (apiKey) => ({ "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }),
    transformBody: (model, messages, stream) => ({ model, messages, stream }),
    extractContent: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  mistral: {
    baseUrl: "https://api.mistral.ai/v1/chat/completions",
    getHeaders: (apiKey) => ({ "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }),
    transformBody: (model, messages, stream) => ({ model, messages, stream }),
    extractContent: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    getHeaders: (apiKey) => ({ "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }),
    transformBody: (model, messages, stream) => ({ model, messages, stream }),
    extractContent: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  perplexity: {
    baseUrl: "https://api.perplexity.ai/chat/completions",
    getHeaders: (apiKey) => ({ "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }),
    transformBody: (model, messages, stream) => ({ model, messages, stream }),
    extractContent: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    getHeaders: (apiKey) => ({ "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }),
    transformBody: (model, messages, stream) => ({ model, messages, stream }),
    extractContent: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  grok: {
    baseUrl: "https://api.x.ai/v1/chat/completions",
    getHeaders: (apiKey) => ({ "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }),
    transformBody: (model, messages, stream) => ({ model, messages, stream }),
    extractContent: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  deepseek: {
    baseUrl: "https://api.deepseek.com/chat/completions",
    getHeaders: (apiKey) => ({ "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }),
    transformBody: (model, messages, stream) => ({ model, messages, stream }),
    extractContent: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  anthropic: {
    baseUrl: "https://api.anthropic.com/v1/messages",
    getHeaders: (apiKey) => ({ "x-api-key": apiKey, "Content-Type": "application/json", "anthropic-version": "2023-06-01" }),
    transformBody: (model, messages, _stream) => {
      const systemMsg = messages.find(m => m.role === "system");
      const chatMsgs = messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content }));
      return { model, messages: chatMsgs, max_tokens: 4096, ...(systemMsg ? { system: systemMsg.content } : {}) };
    },
    extractContent: (data: any) => data.content?.[0]?.text || "",
  },
};

async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: ChatRequest = await req.json();
    const { provider, model, apiKey, messages, stream } = body;

    if (!provider || !model || !apiKey || !messages?.length) {
      return new Response(JSON.stringify({ error: "Missing required fields: provider, model, apiKey, messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = PROVIDER_CONFIGS[provider];
    if (!config) {
      return new Response(JSON.stringify({ error: `Unknown provider: ${provider}. Supported: ${Object.keys(PROVIDER_CONFIGS).join(", ")}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const requestBody = config.transformBody(model, messages, !!stream);

    // Streaming response
    if (stream) {
      const response = await fetch(config.baseUrl, {
        method: "POST",
        headers: config.getHeaders(apiKey),
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errText = await response.text();
        return new Response(JSON.stringify({ error: `Provider error (${response.status}): ${errText}` }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // For Anthropic streaming, we'd need different handling, but for MVP use non-stream
      return new Response(response.body, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming response
    const response = await fetch(config.baseUrl, {
      method: "POST",
      headers: config.getHeaders(apiKey),
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `Provider error (${response.status}): ${errText}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = config.extractContent(data);

    return new Response(JSON.stringify({ content, raw: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    const msg = error.name === "AbortError" ? "Request timed out after 120s" : (error.message || "Internal error");
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

Deno.serve(handler);
