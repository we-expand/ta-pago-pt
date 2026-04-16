import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const router = new Hono();

/**
 * 🎙️ GOOGLE CLOUD TEXT-TO-SPEECH SERVICE - ROTAS PÚBLICAS
 * 
 * ⚠️ ROTAS PÚBLICAS SEM AUTENTICAÇÃO - Para resolver problema de 401
 * Estas rotas NÃO requerem headers de autenticação Supabase
 */

// ========== ROTAS PÚBLICAS ==========

// Rota PÚBLICA para testar configuração (SEM auth)
router.get("/make-server-12af7011/tts/google/test-public", async (c) => {
  try {
    console.log("🔥🔥🔥 [GOOGLE TTS TEST PUBLIC] ========== ROTA PÚBLICA CHAMADA ==========");
    console.log("[GOOGLE TTS TEST PUBLIC] Headers recebidos:", Object.fromEntries(c.req.raw.headers.entries()));
    
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    
    if (!apiKey) {
      console.log("[GOOGLE TTS TEST PUBLIC] ❌ API Key não configurada no ambiente");
      return c.json({
        success: false,
        error: "GOOGLE_CLOUD_API_KEY não configurada",
        configured: false,
      });
    }

    console.log("[GOOGLE TTS TEST PUBLIC] ✅ API Key encontrada! Testando...");

    // Testar com Google Cloud API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=pt-PT`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GOOGLE TTS TEST PUBLIC] ❌ Erro Google API:", errorData);
      
      let userFriendlyError = "API Key inválida ou erro na API";
      
      if (errorData.error) {
        if (errorData.error.code === 403) {
          userFriendlyError = "API Key inválida ou sem permissões para Text-to-Speech";
        } else if (errorData.error.code === 400) {
          userFriendlyError = "API Key com formato inválido";
        } else if (errorData.error.message) {
          userFriendlyError = errorData.error.message;
        }
      }
      
      return c.json({
        success: false,
        error: userFriendlyError,
        details: errorData
      });
    }

    const data = await response.json();
    const ptPTVoices = data.voices?.filter((v: any) => 
      v.languageCodes.includes('pt-PT')
    ) || [];

    console.log(`[GOOGLE TTS TEST PUBLIC] ✅ ${ptPTVoices.length} vozes PT-PT disponíveis!`);

    return c.json({
      success: true,
      configured: true,
      voicesAvailable: ptPTVoices.length,
      voices: ptPTVoices.map((v: any) => ({
        name: v.name,
        gender: v.ssmlGender,
      }))
    });

  } catch (error: any) {
    console.error("[GOOGLE TTS TEST PUBLIC] ❌ Erro fatal:", error);
    return c.json({ 
      success: false,
      error: `Erro de conexão: ${error.message}`,
      details: error.stack
    }, 500);
  }
});

// Rota PÚBLICA para configurar API Key (SEM auth)
router.post("/make-server-12af7011/tts/google/configure-public", async (c) => {
  try {
    console.log("🔥🔥🔥 [GOOGLE TTS CONFIG PUBLIC] ========== ROTA PÚBLICA CHAMADA ==========");
    console.log("[GOOGLE TTS CONFIG PUBLIC] Headers:", Object.fromEntries(c.req.raw.headers.entries()));
    
    const { apiKey } = await c.req.json();

    if (!apiKey || !apiKey.trim()) {
      return c.json({ 
        success: false,
        error: "API Key é obrigatória" 
      }, 400);
    }

    if (!apiKey.startsWith("AIzaSy")) {
      return c.json({ 
        success: false,
        error: "Formato de API Key inválido. Deve começar com 'AIzaSy...'" 
      }, 400);
    }

    console.log("[GOOGLE TTS CONFIG PUBLIC] Salvando API Key...");

    // Guardar no KV store
    await kv.set("google_cloud_api_key", apiKey);

    // Também definir no ambiente
    Deno.env.set("GOOGLE_CLOUD_API_KEY", apiKey);

    console.log("[GOOGLE TTS CONFIG PUBLIC] ✅ API Key guardada!");

    return c.json({
      success: true,
      message: "API Key configurada com sucesso",
      configured: true,
    });

  } catch (error: any) {
    console.error("[GOOGLE TTS CONFIG PUBLIC] ❌ Erro:", error);
    return c.json({ 
      success: false,
      error: "Erro ao guardar API Key",
      details: error.message 
    }, 500);
  }
});

// Rota PÚBLICA para sintetizar áudio (SEM auth)
router.post("/make-server-12af7011/tts/google/synthesize-public", async (c) => {
  try {
    console.log("🔥🔥🔥 [GOOGLE TTS SYNTH PUBLIC] ========== ROTA PÚBLICA CHAMADA ==========");
    
    const { text, voice = "pt-PT-Wavenet-D" } = await c.req.json();

    if (!text) {
      return c.json({ error: "Campo 'text' é obrigatório" }, 400);
    }

    console.log(`[GOOGLE TTS SYNTH PUBLIC] Sintetizando ${text.length} caracteres com voz ${voice}...`);

    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    
    if (!apiKey) {
      console.error("[GOOGLE TTS SYNTH PUBLIC] ❌ API Key não configurada");
      return c.json({ 
        error: "API Key do Google Cloud não configurada"
      }, 400);
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "pt-PT",
            name: voice,
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GOOGLE TTS SYNTH PUBLIC] ❌ Erro Google:", errorData);
      return c.json({ 
        error: "Erro ao gerar áudio",
        details: errorData 
      }, response.status);
    }

    const data = await response.json();
    
    console.log("[GOOGLE TTS SYNTH PUBLIC] ✅ Áudio gerado com sucesso!");

    return c.json({
      success: true,
      audioContent: data.audioContent,
    });

  } catch (error: any) {
    console.error("[GOOGLE TTS SYNTH PUBLIC] ❌ Erro:", error);
    return c.json({ 
      error: "Erro interno ao processar TTS",
      details: error.message 
    }, 500);
  }
});

// ========== ROTAS ORIGINAIS (MANTIDAS) ==========

// Rota para configurar/guardar a API Key
router.post("/make-server-12af7011/tts/google/configure", async (c) => {
  try {
    console.log("[GOOGLE TTS CONFIG] ========== ROTA CHAMADA ==========");
    console.log("[GOOGLE TTS CONFIG] Headers:", Object.fromEntries(c.req.raw.headers.entries()));
    
    const { apiKey } = await c.req.json();

    if (!apiKey || !apiKey.trim()) {
      return c.json({ 
        success: false,
        error: "API Key é obrigatória" 
      }, 400);
    }

    // Validar formato básico da chave Google Cloud
    if (!apiKey.startsWith("AIzaSy")) {
      return c.json({ 
        success: false,
        error: "Formato de API Key inválido. Deve começar com 'AIzaSy...'" 
      }, 400);
    }

    console.log("[GOOGLE TTS CONFIG] Salvando API Key...");

    // Guardar no KV store com chave específica
    await kv.set("google_cloud_api_key", apiKey);

    // Também definir no ambiente para uso imediato
    Deno.env.set("GOOGLE_CLOUD_API_KEY", apiKey);

    console.log("[GOOGLE TTS CONFIG] ✅ API Key guardada com sucesso");

    return c.json({
      success: true,
      message: "API Key configurada com sucesso",
      configured: true,
    });

  } catch (error: any) {
    console.error("[GOOGLE TTS CONFIG] Error:", error);
    return c.json({ 
      success: false,
      error: "Erro ao guardar API Key",
      details: error.message 
    }, 500);
  }
});

// Rota para gerar áudio com Google TTS
router.post("/make-server-12af7011/tts/google/synthesize", async (c) => {
  try {
    const { text, voice = "pt-PT-Wavenet-A" } = await c.req.json();

    if (!text) {
      return c.json({ error: "Campo 'text' é obrigatório" }, 400);
    }

    console.log(`[GOOGLE TTS] Synthesizing text (${text.length} chars) with voice ${voice}`);

    // Obter API key do ambiente
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    
    if (!apiKey) {
      console.error("[GOOGLE TTS] GOOGLE_CLOUD_API_KEY não configurada");
      return c.json({ 
        error: "API Key do Google Cloud não configurada",
        details: "Configure GOOGLE_CLOUD_API_KEY nas variáveis de ambiente"
      }, 500);
    }

    // Fazer request para Google Cloud TTS API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "pt-PT",
            name: voice,
          },
          audioConfig: {
            audioEncoding: "MP3",
            pitch: 0,
            speakingRate: 1.0,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GOOGLE TTS] API Error:", errorData);
      return c.json({ 
        error: "Erro ao gerar áudio",
        details: errorData.error?.message || "Erro desconhecido",
        status: response.status
      }, response.status);
    }

    const data = await response.json();

    if (!data.audioContent) {
      console.error("[GOOGLE TTS] No audio content in response");
      return c.json({ error: "Resposta da API não contém áudio" }, 500);
    }

    console.log(`[GOOGLE TTS] ✅ Audio generated successfully`);

    return c.json({
      success: true,
      audioContent: data.audioContent, // Base64 encoded audio
      voice: voice,
      textLength: text.length,
    });

  } catch (error: any) {
    console.error("[GOOGLE TTS] Error:", error);
    return c.json({ 
      error: "Erro interno ao processar TTS",
      details: error.message 
    }, 500);
  }
});

// Rota para testar configuração da API
router.get("/make-server-12af7011/tts/google/test", async (c) => {
  try {
    console.log("[GOOGLE TTS TEST] ========== ROTA CHAMADA ==========");
    console.log("[GOOGLE TTS TEST] Headers:", Object.fromEntries(c.req.raw.headers.entries()));
    
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    
    if (!apiKey) {
      console.log("[GOOGLE TTS TEST] ❌ API Key não configurada no ambiente");
      return c.json({
        success: false,
        error: "GOOGLE_CLOUD_API_KEY não configurada",
        configured: false,
      });
    }

    console.log("[GOOGLE TTS TEST] ✅ API Key encontrada no ambiente");
    console.log("[GOOGLE TTS TEST] Testando API Key...");

    // Teste simples: listar vozes disponíveis
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=pt-PT`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GOOGLE TTS TEST] Erro da API Google:", errorData);
      
      // Mensagens de erro mais específicas
      let userFriendlyError = "API Key inválida ou erro na API";
      let suggestion = "";
      
      if (errorData.error?.message?.includes("has not been used in project") || 
          errorData.error?.message?.includes("API has not been enabled")) {
        userFriendlyError = "API Cloud Text-to-Speech NÃO está ativada no projeto";
        suggestion = "Ative em: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com";
      } else if (errorData.error?.message?.includes("API key not valid")) {
        userFriendlyError = "Formato da API Key inválido";
        suggestion = "Verifique se a chave começa com 'AIzaSy' e tem ~39 caracteres";
      } else if (errorData.error?.message?.includes("referer")) {
        userFriendlyError = "Restrições de domínio bloqueando o acesso";
        suggestion = "Adicione '*.supabase.co/*' nas restrições HTTP da chave";
      } else if (errorData.error?.code === 403) {
        userFriendlyError = "Permissão negada - API não está ativada ou restrições incorretas";
        suggestion = "1) Ative a API Text-to-Speech\n2) Verifique restrições da chave";
      }
      
      return c.json({
        success: false,
        error: userFriendlyError,
        details: errorData.error?.message,
        suggestion,
        googleErrorCode: errorData.error?.code,
        configured: true,
        valid: false,
      });
    }

    const data = await response.json();
    const ptPTVoices = data.voices || [];

    console.log(`[GOOGLE TTS TEST] ✅ API Key válida! ${ptPTVoices.length} vozes PT-PT disponíveis`);

    return c.json({
      success: true,
      configured: true,
      valid: true,
      voicesAvailable: ptPTVoices.length,
      voices: ptPTVoices.map((v: any) => ({
        name: v.name,
        gender: v.ssmlGender,
        type: v.name.includes("Wavenet") ? "Neural (Premium)" : v.name.includes("Standard") ? "Standard" : "Desconhecido",
      })),
    });

  } catch (error: any) {
    console.error("[GOOGLE TTS TEST] Error:", error);
    return c.json({
      success: false,
      error: "Erro ao testar API",
      details: error.message,
    });
  }
});

// Rota para listar vozes PT-PT disponíveis
router.get("/make-server-12af7011/tts/google/voices", async (c) => {
  try {
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    
    if (!apiKey) {
      return c.json({ error: "API Key não configurada" }, 500);
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=pt-PT`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return c.json({ 
        error: "Erro ao listar vozes",
        details: errorData.error?.message 
      }, response.status);
    }

    const data = await response.json();

    return c.json({
      success: true,
      voices: data.voices || [],
    });

  } catch (error: any) {
    console.error("[GOOGLE TTS VOICES] Error:", error);
    return c.json({ 
      error: "Erro ao listar vozes",
      details: error.message 
    }, 500);
  }
});

export default router;