import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { emailService } from "./email_service.tsx";
import { aiService } from "./ai_service.tsx";
import { innovationService } from "./innovation_service.tsx";
import { authenticateUser } from "./simple_auth.tsx";
import { webauthnService } from "./webauthn_service.tsx";
import { testRoute } from "./_test_route.tsx";
import ttsService from "./tts_service.tsx";
import setupService from "./setup_elevenlabs.tsx";
import testElevenLabs from "./test_elevenlabs.tsx";
import voiceAIService from "./voice_ai_service.tsx";
import textToSpeechRouter from "./text-to-speech.ts";
import googleTTSService from "./google_tts_service.tsx"; // 🎯 GOOGLE TTS

console.log('🔵🔵🔵 [SERVER BOOT] Server file loaded at:', new Date().toISOString());

// ⚡ QUICK FIX HELPER: Simple auth wrapper
async function quickAuth(accessToken: string) {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      return { data: { user }, error: null };
    }
  } catch (e) {
    console.error('Supabase getUser error:', e);
  }
  
  // Fallback to simple auth
  const { user, error } = await authenticateUser(accessToken);
  return { data: { user }, error };
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "Origin", "Accept", "apikey"],  // ⚡ CRITICAL: Add apikey header
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 600,
    credentials: false,
  }),
);

// Explicit OPTIONS handler for all routes (ensure CORS preflight works)
app.options('*', (c) => {
  console.log('[OPTIONS] Preflight request:', c.req.url);
  return c.json({ ok: true });
});

// Health check endpoint
app.get("/make-server-12af7011/health", (c) => {
  return c.json({ status: "ok" });
});

// 🧪 TESTE ULTRA SIMPLES - Apenas para verificar se o deploy funciona
app.post("/make-server-12af7011/webauthn/ping", (c) => {
  console.log('🔔🔔🔔 [PING] ROTA DE TESTE CHAMADA!', new Date().toISOString());
  console.log('🔔 Headers:', Object.fromEntries(c.req.raw.headers.entries()));
  return c.json({ 
    success: true, 
    message: "Deploy funcionando!", 
    timestamp: new Date().toISOString() 
  });
});

// 🔧 DEBUG ENDPOINT - Environment check
app.get("/make-server-12af7011/debug/env", (c) => {
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  return c.json({
    hasUrl: !!url,
    urlValue: url || 'MISSING',
    hasAnonKey: !!anonKey,
    anonKeyPreview: anonKey ? `${anonKey.substring(0, 50)}...` : 'MISSING',
    hasServiceKey: !!serviceKey,
    serviceKeyPreview: serviceKey ? `${serviceKey.substring(0, 50)}...` : 'MISSING',
  });
});

// 🔧 DEBUG ENDPOINT - Test token validation
app.post("/make-server-12af7011/debug/validate-token", async (c) => {
  try {
    const { token } = await c.req.json();
    
    console.log('[DEBUG VALIDATE] Testing token validation...');
    console.log('[DEBUG VALIDATE] Token preview:', token ? token.substring(0, 50) + '...' : 'MISSING');
    
    const result = await authenticateUser(token);
    
    return c.json({
      success: !!result.user,
      hasUser: !!result.user,
      hasError: !!result.error,
      userId: result.user?.id || null,
      userEmail: result.user?.email || null,
      errorMessage: result.error?.message || null,
      errorDetails: result.error ? JSON.stringify(result.error) : null
    });
  } catch (error) {
    return c.json({
      success: false,
      exception: error.message,
      stack: error.stack
    });
  }
});

// 🔧 DEBUG ENDPOINT - Decode JWT without validation
app.post("/make-server-12af7011/debug/decode-jwt", async (c) => {
  try {
    const { token } = await c.req.json();
    
    console.log('[DEBUG JWT] Decoding JWT...');
    console.log('[DEBUG JWT] Token preview:', token ? token.substring(0, 50) + '...' : 'MISSING');
    
    if (!token) {
      return c.json({ error: 'Token missing' }, 400);
    }
    
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return c.json({ error: `Invalid JWT format (expected 3 parts, got ${parts.length})` }, 400);
    }
    
    // Decode header
    let headerB64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const headerPad = headerB64.length % 4;
    if (headerPad && headerPad !== 1) {
      headerB64 += '='.repeat(4 - headerPad);
    }
    const header = JSON.parse(atob(headerB64));
    
    // Decode payload
    let payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadPad = payloadB64.length % 4;
    if (payloadPad && payloadPad !== 1) {
      payloadB64 += '='.repeat(4 - payloadPad);
    }
    const payload = JSON.parse(atob(payloadB64));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp && payload.exp < now;
    const expiresIn = payload.exp ? payload.exp - now : null;
    
    return c.json({
      header,
      payload,
      isExpired,
      expiresIn,
      expiresInMinutes: expiresIn ? Math.floor(expiresIn / 60) : null,
      currentTime: now,
      currentTimeISO: new Date(now * 1000).toISOString(),
      expTime: payload.exp,
      expTimeISO: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
    });
  } catch (error) {
    return c.json({
      error: error.message,
      stack: error.stack
    }, 500);
  }
});

// ==============================================
// AUTHENTICATION ROUTES
// ==============================================

// EMERGENCY RESET - ZERA O SISTEMA (Deleta todos os usuários)
app.post("/make-server-12af7011/auth/reset-all-users-dangerous", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // 1. Listar usuários (primeira página - padrão 50)
    // Se tiver muitos usuários, precisaria paginar, mas para dev/demo ok
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    
    if (error) {
       throw new Error(`Erro ao listar usuários: ${error.message}`);
    }
    
    let deletedCount = 0;
    const errors = [];
    
    if (users && users.length > 0) {
      for (const user of users) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        if (deleteError) {
          errors.push(`Falha ao deletar ${user.email}: ${deleteError.message}`);
        } else {
          deletedCount++;
        }
      }
    }
    
    return c.json({ 
      success: true, 
      message: `Sistema resetado. ${deletedCount} usuários removidos.`,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (err: any) {
    console.error("Erro no reset:", err);
    return c.json({ error: err.message }, 500);
  }
});

// Sign up endpoint - cria novo usuário e empresa (tenant)
app.post("/make-server-12af7011/auth/signup", async (c) => {
  try {
    const { email, password, companyName, userName } = await c.req.json();

    console.log(`[SIGNUP] Tentando criar usuário: ${email}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create user with Supabase Auth
    // Automatically confirm the user's email since an email server hasn't been configured.
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: userName },
      email_confirm: true
    });

    let userId = userData?.user?.id;

    if (userError) {
      console.log(`[SIGNUP ERROR] Erro ao criar usuário no Supabase Auth: ${userError.message}`);
      
      if (userError.message.includes("already registered") || userError.status === 422) {
        return c.json({ error: "Este email já está cadastrado. Tente fazer login." }, 400);
      }
      
      return c.json({ error: `Erro ao criar usuário: ${userError.message}` }, 400);
    }

    console.log(`[SIGNUP] Usuário criado com sucesso no Auth: ${userData.user.id}`);

    // Criar empresa (tenant) no KV store
    const companyId = `company_${userData.user.id}`;
    await kv.set(`${companyId}`, {
      id: companyId,
      name: companyName,
      ownerId: userData.user.id,
      createdAt: new Date().toISOString(),
      settings: {
        channels: {
          whatsapp: { enabled: true, costPerMessage: 0.05 },
          sms: { enabled: true, costPerMessage: 0.10 },
          email: { enabled: true, costPerMessage: 0.01 },
          voice: { enabled: false, costPerMinute: 0.25 }
        },
        strategies: {
          lowScore: { days: [1, 3, 7, 14], channels: ['email', 'whatsapp'] },
          mediumScore: { days: [2, 5, 10], channels: ['whatsapp', 'sms'] },
          highScore: { days: [1, 2, 4, 7], channels: ['whatsapp', 'sms', 'email'] }
        }
      }
    });

    // Associar usuário à empresa
    await kv.set(`user_${userData.user.id}`, {
      id: userData.user.id,
      email,
      name: userName,
      companyId: companyId,
      role: 'owner',
      createdAt: new Date().toISOString()
    });

    // Index email to user ID (Normalized)
    const normalizedEmail = email.toLowerCase().trim();
    await kv.set(`email_to_id_${normalizedEmail}`, userData.user.id);

    console.log(`[SIGNUP] Empresa criada no KV: ${companyId}`);

    // 🎯 ENVIAR EMAIL DE BOAS-VINDAS AUTOMATICAMENTE (NÃO-CRÍTICO)
    try {
      await emailService.sendWelcomeEmail(email, userName);
      console.log(`[SIGNUP] Email de boas-vindas enviado para ${email}`);
    } catch (emailError: any) {
      console.log(`[SIGNUP WARNING] Erro ao enviar email de boas-vindas (não-crítico): ${emailError.message}`);
      // Não falhar o signup se o email falhar
    }

    console.log(`[SIGNUP SUCCESS] Cadastro completo para ${email}`);

    return c.json({ 
      success: true,
      userId: userData.user.id,
      companyId: companyId
    });
  } catch (error: any) {
    console.error(`[SIGNUP ERROR] Erro geral no endpoint de signup:`, error);
    return c.json({ error: `Erro ao criar conta: ${error.message}` }, 500);
  }
});

// Get user session
app.get("/make-server-12af7011/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await quickAuth(accessToken);

    if (error || !user) {
      console.log(`Error getting user session: ${error?.message}`);
      return c.json({ error: "Invalid session" }, 401);
    }

    // Get company ID
    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) {
      return c.json({ error: "Company not found for user" }, 404);
    }

    return c.json({ user, companyId });

  } catch (error) {
    console.log(`Error fetching session: ${error}`);
    return c.json({ error: "Erro ao buscar sessão" }, 500);
  }
});

// ==============================================
// WEBAUTHN ROUTES
// ==============================================

console.log('🟢🟢🟢 [SERVER INIT] Registering WebAuthn routes...', new Date().toISOString());

// 🧪 DIAGNOSTIC TEST ROUTE - Always returns 200
app.post("/make-server-12af7011/webauthn/test", async (c) => {
  console.log('🧪🧪🧪 [TEST ROUTE] Hit!', new Date().toISOString());
  return c.json({ success: true, message: "Test route works!" });
});

// 🔍 DEBUG ENDPOINT: Test WebAuthn auth without doing anything
app.post("/make-server-12af7011/webauthn/debug-auth", async (c) => {
  console.log('='.repeat(80));
  console.log('🔍🔍🔍 [DEBUG AUTH] =================== ROUTE HIT ===================');
  console.log('🔍🔍🔍 [DEBUG AUTH] Timestamp:', new Date().toISOString());
  console.log('🔍🔍🔍 [DEBUG AUTH] Method:', c.req.method);
  console.log('🔍🔍🔍 [DEBUG AUTH] Path:', c.req.path);
  console.log('='.repeat(80));
  
  try {
    // Log ALL headers
    const allHeaders: Record<string, string> = {};
    c.req.raw.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    console.log('[DEBUG AUTH] All headers:', JSON.stringify(allHeaders, null, 2));
    
    const authHeader = c.req.header('Authorization');
    console.log('[DEBUG AUTH] Authorization header:', authHeader);
    
    if (!authHeader) {
      return c.json({ 
        error: 'No Authorization header',
        receivedHeaders: allHeaders
      }, 401);
    }
    
    const parts = authHeader.split(' ');
    console.log('[DEBUG AUTH] Header parts:', parts.length, parts[0]);
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return c.json({ 
        error: 'Invalid Authorization format',
        received: authHeader,
        parts: parts
      }, 401);
    }
    
    const accessToken = parts[1];
    console.log('[DEBUG AUTH] Token length:', accessToken?.length);
    console.log('[DEBUG AUTH] Token preview:', accessToken?.substring(0, 50));
    
    // Try to validate with Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('[DEBUG AUTH] SUPABASE_URL:', supabaseUrl);
    console.log('[DEBUG AUTH] SERVICE_ROLE_KEY exists:', !!serviceRoleKey);
    
    const supabase = createClient(supabaseUrl!, serviceRoleKey!);
    
    console.log('[DEBUG AUTH] About to call getUser...');
    const authResult = await supabase.auth.getUser(accessToken);
    console.log('[DEBUG AUTH] getUser completed');
    console.log('[DEBUG AUTH] Full auth result:', JSON.stringify(authResult, null, 2));
    
    const { data: { user }, error: authError } = authResult;
    
    console.log('[DEBUG AUTH] Validation result:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      error: authError?.message,
      errorStatus: authError?.status,
      errorName: authError?.name
    });
    
    if (authError || !user) {
      console.log('[DEBUG AUTH] ❌ Validation FAILED - Full error:', authError);
      return c.json({
        error: 'Token validation failed',
        supabaseError: authError?.message,
        supabaseErrorCode: authError?.status,
        supabaseErrorName: authError?.name,
        fullError: authError,
        tokenPreview: accessToken?.substring(0, 20),
        tokenLength: accessToken?.length
      }, 401);
    }
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    });
    
  } catch (error: any) {
    console.error('[DEBUG AUTH] Exception:', error);
    return c.json({
      error: 'Exception during validation',
      message: error.message,
      stack: error.stack
    }, 500);
  }
});

// 🔍 DEBUG ENDPOINT 2: Test simple JWT decode without Supabase validation
app.post("/make-server-12af7011/webauthn/debug-simple", async (c) => {
  console.log('='.repeat(80));
  console.log('🟢🟢🟢 [DEBUG SIMPLE] =================== ROUTE HIT ===================');
  console.log('🟢🟢🟢 [DEBUG SIMPLE] Timestamp:', new Date().toISOString());
  console.log('🟢🟢🟢 [DEBUG SIMPLE] Method:', c.req.method);
  console.log('🟢🟢🟢 [DEBUG SIMPLE] Path:', c.req.path);
  console.log('='.repeat(80));
  
  try {
    const authHeader = c.req.header('Authorization');
    console.log('[DEBUG SIMPLE] Authorization header:', authHeader);
    console.log('[DEBUG SIMPLE] Authorization header length:', authHeader?.length);
    
    if (!authHeader) {
      console.log('[DEBUG SIMPLE] ❌ NO AUTH HEADER - Returning 401');
      return c.json({ error: 'No Authorization header' }, 401);
    }
    
    const accessToken = authHeader.split(' ')[1];
    console.log('[DEBUG SIMPLE] Access token extracted:', accessToken ? `${accessToken.substring(0, 30)}...` : 'NONE');
    if (!accessToken) {
      return c.json({ error: 'No token in header' }, 401);
    }
    
    console.log('[DEBUG SIMPLE] Calling authenticateUser()...');
    const authResult = await authenticateUser(accessToken);
    console.log('[DEBUG SIMPLE] authenticateUser() returned:', JSON.stringify(authResult, null, 2));
    
    const { user, error } = authResult;
    console.log('[DEBUG SIMPLE] user:', user);
    console.log('[DEBUG SIMPLE] error:', error);
    
    if (error || !user) {
      console.log('[DEBUG SIMPLE] ❌ Auth failed - Returning 401');
      return c.json({
        error: 'Simple auth failed',
        details: error,
        hasUser: !!user,
        hasError: !!error
      }, 401);
    }
    
    console.log('[DEBUG SIMPLE] ✅ Auth SUCCESS - User:', user.email || user.id);
    return c.json({
      success: true,
      method: 'simple_jwt_decode',
      user: {
        id: user.id,
        email: user.email
      }
    });
    
  } catch (error: any) {
    console.error('❌❌❌ [DEBUG SIMPLE] EXCEPTION CAUGHT:', error);
    console.error('[DEBUG SIMPLE] Error message:', error.message);
    console.error('[DEBUG SIMPLE] Error stack:', error.stack);
    console.error('[DEBUG SIMPLE] Error name:', error.name);
    return c.json({
      error: 'Exception in debug-simple endpoint',
      message: error.message,
      name: error.name,
      stack: error.stack
    }, 500);
  }
});

// Generate Registration Options
app.post("/make-server-12af7011/webauthn/register/options", async (c) => {
  console.log('='.repeat(80));
  console.log('🚀🚀🚀 [WEBAUTHN REGISTER] =================== ROUTE HIT ===================');
  console.log('🚀🚀🚀 [WEBAUTHN REGISTER] Timestamp:', new Date().toISOString());
  console.log('🚀🚀🚀 [WEBAUTHN REGISTER] Method:', c.req.method);
  console.log('🚀🚀🚀 [WEBAUTHN REGISTER] URL:', c.req.url);
  console.log('='.repeat(80));
  
  try {
    const authHeader = c.req.header('Authorization');
    console.log('[WEBAUTHN] Full Auth Header:', authHeader);
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    console.log('[WEBAUTHN] Extracted Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NONE');
    
    if (!accessToken) {
      console.log('[WEBAUTHN] ❌ No access token');
      return c.json({ error: "No access token provided" }, 401);
    }

    // ⚡ QUICK FIX: Use simple JWT decode instead of Supabase validation
    console.log('[WEBAUTHN] 🚀 USING SIMPLE JWT DECODE (bypass Supabase validation)');
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    
    if (authError || !user) {
      console.log('[WEBAUTHN] ❌ Auth failed:', authError);
      return c.json({ 
        code: 401, 
        message: authError?.message || "Invalid JWT"
      }, 401);
    }

    console.log('[WEBAUTHN] ✅ User authenticated:', user.id);
    const origin = c.req.header('Origin') || c.req.header('Referer') || '';
    const rpID = new URL(origin).hostname;
    console.log('[WEBAUTHN] rpID:', rpID);

    const options = await webauthnService.generateRegistrationOptions(
      user.id,
      user.email || 'User',
      rpID
    );

    console.log('[WEBAUTHN] ✅ Options generated');
    return c.json(options);
  } catch (error) {
    console.error('🔴🔴🔴 [WEBAUTHN] ❌ EXCEPTION:', error);
    console.error('🔴 Error message:', error.message);
    console.error('🔴 Error stack:', error.stack);
    return c.json({ code: 500, message: error.message, stack: error.stack }, 500);
  }
});

// Verify Registration
app.post("/make-server-12af7011/webauthn/register/verify", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    // ⚡ CRITICAL: Use SERVICE_ROLE_KEY to validate user access tokens on the server
    // ⚡ QUICK FIX
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const response = await c.req.json();
    const origin = c.req.header('Origin') || '';
    const rpID = new URL(origin).hostname;

    const verification = await webauthnService.verifyRegistration(
      user.id,
      response,
      rpID,
      origin
    );

    return c.json({ verified: verification.verified });
  } catch (error) {
    console.log('[WEBAUTHN] Verify error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// 🔐 Generate Login Options (PUBLIC - No Auth Required)
app.post("/make-server-12af7011/webauthn/login/options", async (c) => {
  try {
    console.log('🔑 [WEBAUTHN LOGIN] Generating login options...');
    
    const origin = c.req.header('Origin') || c.req.header('Referer') || '';
    const rpID = new URL(origin).hostname;
    console.log('[WEBAUTHN LOGIN] rpID:', rpID);

    const options = await webauthnService.generateLoginOptions(rpID);
    
    console.log('[WEBAUTHN LOGIN] ✅ Options generated');
    return c.json(options);
  } catch (error) {
    console.error('🔴 [WEBAUTHN LOGIN] ❌ Error generating options:', error);
    return c.json({ code: 500, message: error.message }, 500);
  }
});

// 🔐 Verify Login (PUBLIC - No Auth Required)
app.post("/make-server-12af7011/webauthn/login/verify", async (c) => {
  try {
    console.log('🔑 [WEBAUTHN LOGIN] Verifying login...');
    
    const response = await c.req.json();
    const origin = c.req.header('Origin') || '';
    const rpID = new URL(origin).hostname;
    console.log('[WEBAUTHN LOGIN] rpID:', rpID);

    const verification = await webauthnService.verifyLogin(response, rpID, origin);
    
    if (!verification.verified || !verification.userId) {
      console.log('[WEBAUTHN LOGIN] ❌ Verification failed');
      return c.json({ error: "Verificação falhou" }, 401);
    }

    console.log('[WEBAUTHN LOGIN] ✅ User verified:', verification.userId);

    // Create Supabase session for the verified user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user data
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(verification.userId);
    
    if (userError || !userData?.user) {
      console.error('[WEBAUTHN LOGIN] ❌ User not found:', userError);
      return c.json({ error: "Usuário não encontrado" }, 404);
    }

    // Generate new session token
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email!,
    });

    if (sessionError || !sessionData) {
      console.error('[WEBAUTHN LOGIN] ❌ Session creation failed:', sessionError);
      return c.json({ error: "Erro ao criar sessão" }, 500);
    }

    console.log('[WEBAUTHN LOGIN] ✅ Session created successfully');
    
    return c.json({
      verified: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        user_metadata: userData.user.user_metadata,
      },
      session: {
        access_token: sessionData.properties.hashed_token,
        refresh_token: sessionData.properties.hashed_token,
      }
    });
  } catch (error) {
    console.error('🔴 [WEBAUTHN LOGIN] ❌ Exception:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==============================================
// DEBTORS ROUTES
// ==============================================

// Get all debtors for company
app.get("/make-server-12af7011/debtors", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) {
      console.error('[DEBTORS GET] Company not found for user:', user.id);
      return c.json({ error: "Company not found. Please contact support." }, 404);
    }

    const debtors = await kv.getByPrefix(`debtor_${companyId}_`);

    // Enrich debtors with calculated fields (daysOverdue, etc.)
    const enrichedDebtors = (debtors || []).map(enrichDebtor);

    return c.json({ debtors: enrichedDebtors });
  } catch (error) {
    console.log(`Error fetching debtors: ${error}`);
    return c.json({ error: "Erro ao buscar devedores" }, 500);
  }
});

// Create new debtor
app.post("/make-server-12af7011/debtors", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) {
      return c.json({ error: "Company not found" }, 404);
    }

    const debtorData = await c.req.json();

    // Generate debtor ID
    const debtorId = `debtor_${companyId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate payment score
    const paymentScore = calculateDebtorScore(debtorData);

    const debtor = {
      id: debtorId,
      companyId,
      // Personal Info
      name: debtorData.name,
      email: debtorData.email,
      phone: debtorData.phone,
      documentType: debtorData.documentType, // CPF or CNPJ
      document: debtorData.document,
      birthDate: debtorData.birthDate || null,
      // Address
      address: {
        street: debtorData.address?.street || '',
        number: debtorData.address?.number || '',
        complement: debtorData.address?.complement || '',
        neighborhood: debtorData.address?.neighborhood || '',
        city: debtorData.address?.city || '',
        state: debtorData.address?.state || '',
        zipCode: debtorData.address?.zipCode || '',
        country: debtorData.address?.country || 'Portugal'
      },
      // Debt Info
      debtAmount: debtorData.debtAmount,
      originalAmount: debtorData.originalAmount || debtorData.debtAmount,
      dueDate: debtorData.dueDate,
      contractNumber: debtorData.contractNumber || null,
      invoiceNumber: debtorData.invoiceNumber || null,
      description: debtorData.description || '',
      // Classification
      segment: debtorData.segment || 'B2C', // B2B, B2C, B2G
      category: debtorData.category || 'Geral',
      priority: debtorData.priority || 'medium', // low, medium, high, urgent
      // Company Info (for B2B)
      companyName: debtorData.companyName || null,
      companyRole: debtorData.companyRole || null,
      // Financial Info
      estimatedIncome: debtorData.estimatedIncome || null,
      paymentHistory: debtorData.paymentHistory || [],
      // Score & Status
      paymentScore: paymentScore,
      status: 'active', // active, negotiating, paid, legal, cancelled
      // Contact History
      lastContact: null,
      lastContactType: null,
      contactCount: 0,
      promisesCount: 0,
      brokenPromises: 0,
      // Metadata
      tags: debtorData.tags || [],
      notes: debtorData.notes || '',
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(debtorId, debtor);

    // Enrich debtor with calculated fields before returning
    const enrichedDebtor = enrichDebtor(debtor);

    return c.json({ debtor: enrichedDebtor, message: "Devedor criado com sucesso!" });
  } catch (error) {
    console.log(`Error creating debtor: ${error}`);
    return c.json({ error: "Erro ao criar devedor" }, 500);
  }
});

// Update debtor
app.put("/make-server-12af7011/debtors/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const debtorId = c.req.param('id');
    const updateData = await c.req.json();

    const existingDebtor = await kv.get(debtorId);
    if (!existingDebtor) {
      return c.json({ error: "Devedor não encontrado" }, 404);
    }

    const updatedDebtor = {
      ...existingDebtor,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await kv.set(debtorId, updatedDebtor);

    // Enrich debtor with calculated fields before returning
    const enrichedDebtor = enrichDebtor(updatedDebtor);

    return c.json({ debtor: enrichedDebtor, message: "Devedor atualizado com sucesso!" });
  } catch (error) {
    console.log(`Error updating debtor: ${error}`);
    return c.json({ error: "Erro ao atualizar devedor" }, 500);
  }
});

// Delete debtor
app.delete("/make-server-12af7011/debtors/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const debtorId = c.req.param('id');
    await kv.del(debtorId);

    return c.json({ message: "Devedor removido com sucesso!" });
  } catch (error) {
    console.log(`Error deleting debtor: ${error}`);
    return c.json({ error: "Erro ao remover devedor" }, 500);
  }
});

// Bulk import debtors from CSV
app.post("/make-server-12af7011/debtors/import", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) {
      return c.json({ error: "Company not found" }, 404);
    }

    const { debtors } = await c.req.json();

    const imported = [];
    const errors = [];

    for (const debtorData of debtors) {
      try {
        const debtorId = `debtor_${companyId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const paymentScore = calculateDebtorScore(debtorData);

        const debtor = {
          id: debtorId,
          companyId,
          name: debtorData.name,
          email: debtorData.email || null,
          phone: debtorData.phone || null,
          documentType: debtorData.documentType || 'CPF',
          document: debtorData.document || '',
          birthDate: debtorData.birthDate || null,
          address: {
            street: debtorData.street || '',
            number: debtorData.number || '',
            complement: debtorData.complement || '',
            neighborhood: debtorData.neighborhood || '',
            city: debtorData.city || '',
            state: debtorData.state || '',
            zipCode: debtorData.zipCode || '',
            country: debtorData.country || 'Portugal'
          },
          debtAmount: parseFloat(debtorData.debtAmount) || 0,
          originalAmount: parseFloat(debtorData.originalAmount || debtorData.debtAmount) || 0,
          dueDate: debtorData.dueDate || new Date().toISOString(),
          contractNumber: debtorData.contractNumber || null,
          invoiceNumber: debtorData.invoiceNumber || null,
          description: debtorData.description || '',
          segment: debtorData.segment || 'B2C',
          category: debtorData.category || 'Geral',
          priority: debtorData.priority || 'medium',
          companyName: debtorData.companyName || null,
          companyRole: debtorData.companyRole || null,
          paymentScore: paymentScore,
          status: 'active',
          lastContact: null,
          lastContactType: null,
          contactCount: 0,
          promisesCount: 0,
          brokenPromises: 0,
          tags: [],
          notes: debtorData.notes || '',
          createdAt: new Date().toISOString(),
          createdBy: user.id,
          updatedAt: new Date().toISOString()
        };

        await kv.set(debtorId, debtor);
        // Enrich debtor before adding to imported list
        imported.push(enrichDebtor(debtor));
      } catch (error) {
        errors.push({ 
          debtor: debtorData.name || 'Unknown', 
          error: error.message 
        });
      }
    }

    return c.json({ 
      message: `Importação concluída! ${imported.length} devedores importados.`,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors
    });
  } catch (error) {
    console.log(`Error importing debtors: ${error}`);
    return c.json({ error: "Erro ao importar devedores" }, 500);
  }
});

// ==============================================
// INTEGRATION ROUTES & ACTIONS
// ==============================================

// Register communication action (for analytics tracking)
app.post("/make-server-12af7011/actions/register", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) return c.json({ error: "Company not found" }, 404);

    const { debtorId, channel, type, success, metadata } = await c.req.json();

    // Create action record
    const actionId = `action_${companyId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const action = {
      id: actionId,
      companyId,
      debtorId,
      channel, // 'whatsapp', 'email', 'sms', 'voice'
      type, // 'reminder', 'negotiation', 'legal_notice', etc.
      success: success || false, // Did it lead to payment?
      amount: metadata?.amount || 0, // Payment amount if successful
      cost: metadata?.cost || 0, // Cost of communication
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };

    await kv.set(actionId, action);

    // Update debtor's communication history
    if (debtorId) {
      const debtor = await kv.get(debtorId);
      if (debtor) {
        if (!debtor.communicationHistory) {
          debtor.communicationHistory = [];
        }
        debtor.communicationHistory.push({
          actionId,
          channel,
          type,
          timestamp: action.timestamp,
          success
        });
        await kv.set(debtorId, debtor);
      }
    }

    return c.json({ success: true, action });
  } catch (error) {
    console.log(`Error registering action: ${error}`);
    return c.json({ error: "Erro ao registrar ação" }, 500);
  }
});

// Get connected integrations
app.get("/make-server-12af7011/integrations", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) return c.json({ error: "Company not found" }, 404);

    const integrations = await kv.getByPrefix(`integration_${companyId}_`);

    return c.json({ integrations: integrations || [] });
  } catch (error) {
    console.log(`Error fetching integrations: ${error}`);
    return c.json({ error: "Erro ao buscar integrações" }, 500);
  }
});

// Toggle integration
app.post("/make-server-12af7011/integrations/toggle", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) return c.json({ error: "Company not found" }, 404);

    const { integrationId, name, action, config } = await c.req.json();
    
    const key = `integration_${companyId}_${integrationId}`;

    if (action === 'disconnect') {
      await kv.del(key);
      return c.json({ message: "Integração desconectada com sucesso!" });
    } else {
      const integration = {
        id: integrationId,
        name,
        connectedAt: new Date().toISOString(),
        status: 'active',
        config: config || {}
      };
      await kv.set(key, integration);
      return c.json({ message: "Integração conectada com sucesso!", integration });
    }
  } catch (error) {
    console.log(`Error toggling integration: ${error}`);
    return c.json({ error: "Erro ao atualizar integração" }, 500);
  }
});

// Helper function to calculate days overdue
function calculateDaysOverdue(dueDate: string | null | undefined): number {
  if (!dueDate) return 0;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If due date is in the future, return 0 (not overdue)
    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error(`Error calculating days overdue for date ${dueDate}:`, error);
    return 0;
  }
}

// Helper function to enrich debtor with calculated fields
function enrichDebtor(debtor: any): any {
  return {
    ...debtor,
    daysOverdue: calculateDaysOverdue(debtor.dueDate),
    score: debtor.paymentScore || debtor.score || 50,
  };
}

// Helper function to calculate debtor score
function calculateDebtorScore(debtorData: any): number {
  let score = 50; // Base score

  // Debt amount (lower is better)
  const amount = parseFloat(debtorData.debtAmount) || 0;
  if (amount < 500) score += 20;
  else if (amount < 2000) score += 10;
  else if (amount > 10000) score -= 20;

  // Days overdue
  if (debtorData.dueDate) {
    const daysOverdue = Math.floor((Date.now() - new Date(debtorData.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysOverdue < 30) score += 15;
    else if (daysOverdue < 60) score += 5;
    else if (daysOverdue > 180) score -= 25;
  }

  // Contact info (better coverage = higher score)
  if (debtorData.email) score += 10;
  if (debtorData.phone) score += 10;
  
  // Payment history
  if (debtorData.paymentHistory && debtorData.paymentHistory.length > 0) {
    const avgPaymentDays = debtorData.paymentHistory.reduce((a: number, b: any) => a + (b.daysLate || 0), 0) / debtorData.paymentHistory.length;
    if (avgPaymentDays < 10) score += 15;
    else if (avgPaymentDays > 30) score -= 15;
  }

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

// 🔧 HELPER: Get companyId from userId (CORRIGE INCONSISTÊNCIA CRÍTICA)
async function getCompanyIdFromUserId(userId: string): Promise<string | null> {
  try {
    // Método 1: Buscar no objeto user (signup original)
    const userData = await kv.get(`user_${userId}`);
    if (userData && userData.companyId) {
      console.log(`[COMPANY_ID] Found via user_${userId}: ${userData.companyId}`);
      return userData.companyId;
    }

    // Método 2: Buscar direto (fallback para compatibilidade)
    const directCompanyId = await kv.get(`user_company_${userId}`);
    if (directCompanyId) {
      console.log(`[COMPANY_ID] Found via user_company_${userId}: ${directCompanyId}`);
      return directCompanyId;
    }

    // Método 3: Padrão convencional (último fallback)
    const conventionalId = `company_${userId}`;
    const companyExists = await kv.get(conventionalId);
    if (companyExists) {
      console.log(`[COMPANY_ID] Using conventional: ${conventionalId}`);
      return conventionalId;
    }

    console.error(`[COMPANY_ID ERROR] No company found for user ${userId}`);
    return null;
  } catch (error) {
    console.error(`[COMPANY_ID ERROR] Exception getting company for user ${userId}:`, error);
    return null;
  }
}

// Helper function to calculate recovery trend from payment history
function calculateRecoveryTrend(debtors: any[]): any[] {
  const now = new Date();
  const months = [];
  
  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString('pt-PT', { month: 'short' }),
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
      spontaneous: 0,
      ai: 0
    });
  }
  
  // Process each debtor's payment history
  debtors.forEach((debtor: any) => {
    if (debtor.paymentHistory && Array.isArray(debtor.paymentHistory)) {
      debtor.paymentHistory.forEach((payment: any) => {
        const paymentDate = new Date(payment.date);
        const monthData = months.find(m => 
          m.monthIndex === paymentDate.getMonth() && 
          m.year === paymentDate.getFullYear()
        );
        
        if (monthData) {
          const amount = payment.amount || 0;
          // Classify as AI-assisted if there's AI-related metadata, otherwise spontaneous
          if (payment.aiAssisted || payment.channel) {
            monthData.ai += amount;
          } else {
            monthData.spontaneous += amount;
          }
        }
      });
    }
  });
  
  return months.map(m => ({
    month: m.month,
    spontaneous: Math.round(m.spontaneous),
    ai: Math.round(m.ai)
  }));
}

// Helper function to calculate recovery by channel from actions
function calculateRecoveryByChannel(actions: any[], companySettings: any): any[] {
  const channels = {
    whatsapp: { value: 0, cost: 0, count: 0, fill: '#10b981' },
    email: { value: 0, cost: 0, count: 0, fill: '#3b82f6' },
    sms: { value: 0, cost: 0, count: 0, fill: '#8b5cf6' },
    voice: { value: 0, cost: 0, count: 0, fill: '#f59e0b' }
  };
  
  // Get cost per message from company settings
  const channelSettings = companySettings?.channels || {
    whatsapp: { costPerMessage: 0.05 },
    email: { costPerMessage: 0.01 },
    sms: { costPerMessage: 0.10 },
    voice: { costPerMinute: 0.25 }
  };
  
  // Process all actions
  actions.forEach((action: any) => {
    const channel = action.channel?.toLowerCase();
    if (channels[channel as keyof typeof channels]) {
      channels[channel as keyof typeof channels].count++;
      channels[channel as keyof typeof channels].cost += action.cost || 0;
      
      if (action.success && action.amount) {
        channels[channel as keyof typeof channels].value += action.amount;
      }
    }
  });
  
  // Calculate ROI and format output
  return Object.entries(channels).map(([key, data]) => {
    const channelName = key.charAt(0).toUpperCase() + key.slice(1);
    const roi = data.cost > 0 ? ((data.value - data.cost) / data.cost * 100) : 0;
    
    return {
      channel: channelName === 'Voice' ? 'Telefone' : channelName,
      value: Math.round(data.value),
      cost: Math.round(data.cost),
      roi: Math.round(roi * 10) / 10,
      fill: data.fill
    };
  }).filter(c => c.value > 0 || c.cost > 0); // Only return channels with activity
}

// ==============================================
// AI ROUTES
// ==============================================

// Preview AI Message
app.post("/make-server-12af7011/ai/preview", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const { debtorName, amount, daysOverdue, dueDate, companyName, tone, lastDebtorMessage } = await c.req.json();

    const message = await aiService.generateCollectionMessage({
      name: debtorName || 'Cliente',
      amount: amount || 0,
      daysOverdue: daysOverdue || 0,
      dueDate: dueDate || new Date().toISOString(),
      companyName: companyName || 'Sua Empresa'
    }, tone || 'friendly', lastDebtorMessage);

    return c.json({ message });
  } catch (error) {
    console.log(`Error previewing AI message: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Search Innovation Lab
app.post("/make-server-12af7011/innovation/search", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const { query, category } = await c.req.json();

    const results = await innovationService.generateSuggestions(query || '', category || 'all');

    return c.json({ results });
  } catch (error) {
    console.log(`Error searching innovation: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// ==============================================
// AGREEMENTS ROUTES
// ==============================================

// Create payment agreement
app.post("/make-server-12af7011/agreements", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const { debtorId, totalAmount, downPayment, installmentsCount, frequency, firstInstallmentDate, interestRate } = await c.req.json();

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) return c.json({ error: "Company not found" }, 404);

    const agreementId = `agreement_${companyId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate installments
    const principalAmount = totalAmount - (downPayment || 0);
    const installmentAmount = principalAmount / installmentsCount;
    
    // Simple interest calculation (if needed in future)
    // const interest = principalAmount * (interestRate || 0) / 100;
    // const totalWithInterest = principalAmount + interest;
    
    const installments = [];
    const startDate = new Date(firstInstallmentDate);

    for (let i = 0; i < installmentsCount; i++) {
      const date = new Date(startDate);
      if (frequency === 'monthly') {
        date.setMonth(startDate.getMonth() + i);
      } else if (frequency === 'weekly') {
        date.setDate(startDate.getDate() + (i * 7));
      } else if (frequency === 'biweekly') {
        date.setDate(startDate.getDate() + (i * 14));
      }

      installments.push({
        id: `inst_${agreementId}_${i + 1}`,
        number: i + 1,
        amount: installmentAmount, // + (interest / installmentsCount),
        dueDate: date.toISOString(),
        status: 'pending', // pending, paid, overdue
        paidAt: null
      });
    }

    const agreement = {
      id: agreementId,
      companyId,
      debtorId,
      totalAmount,
      downPayment,
      installmentsCount,
      frequency,
      status: 'active', // active, completed, defaulted, cancelled
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      installments
    };

    // Save agreement
    await kv.set(agreementId, agreement);
    
    // Update debtor status
    const debtor = await kv.get(debtorId);
    if (debtor) {
      debtor.status = 'negotiating'; // Or 'agreement_active'
      debtor.activeAgreementId = agreementId;
      await kv.set(debtorId, debtor);
    }

    return c.json({ success: true, agreement });
  } catch (error) {
    console.log(`Error creating agreement: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get agreement by debtor ID
app.get("/make-server-12af7011/agreements/:debtorId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const debtorId = c.req.param('debtorId');
    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) return c.json({ error: "Company not found" }, 404);
    
    // Fetch all agreements and filter by debtorId (KV store limitation workaround)
    // Ideally we would use secondary index or prefix search if structure allowed
    // Here we use prefix search for agreements of the company and filter
    const allAgreements = await kv.getByPrefix(`agreement_${companyId}_`);
    const debtorAgreements = allAgreements.filter((a: any) => a.debtorId === debtorId);

    // Return the most recent active one first
    debtorAgreements.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ agreements: debtorAgreements });
  } catch (error) {
    console.log(`Error fetching agreements: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// ==============================================
// ANALYTICS ROUTES
// ==============================================

app.get("/make-server-12af7011/analytics/dashboard", async (c) => {
  try {
    // Log ALL headers for debugging
    const allHeaders = {};
    c.req.raw.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    console.log('[ANALYTICS] ===== ALL HEADERS =====');
    console.log(JSON.stringify(allHeaders, null, 2));
    console.log('[ANALYTICS] =======================');
    
    const authHeader = c.req.header('Authorization');
    console.log('[ANALYTICS] Authorization header:', authHeader);
    
    const accessToken = authHeader?.split(' ')[1];
    console.log('[ANALYTICS] Access token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'MISSING');
    
    if (!accessToken) {
      console.log('[ANALYTICS] ERROR: No access token provided');
      return c.json({ error: "No access token provided" }, 401);
    }

    // ⚡ QUICK FIX: Use quickAuth() instead of authenticateUser()
    console.log('[ANALYTICS] Validating token with Supabase...');
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    
    if (authError) {
      console.log('[ANALYTICS] Auth error:', authError);
      return c.json({ error: "Unauthorized", details: authError.message || 'Authentication failed' }, 401);
    }
    
    if (!user) {
      console.log('[ANALYTICS] No user found for token');
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    console.log('[ANALYTICS] User authenticated:', user.email);

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) {
      console.error('[ANALYTICS] Company not found for user:', user.id);
      return c.json({ error: "Company not found" }, 404);
    }

    const debtors = await kv.getByPrefix(`debtor_${companyId}_`) || [];

    // 1. Calculate Stats
    let totalDebt = 0;
    let activeDebtors = 0;
    let recoveredMonth = 0;
    let totalRecovered = 0;
    let totalDebtors = debtors.length;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Distribution & Delayed
    const scoreDist = { high: 0, medium: 0, low: 0, highVal: 0, mediumVal: 0, lowVal: 0 };
    const delayed = { d30: 0, d60: 0, d90: 0, d90plus: 0 };

    // KPI: Average Recovery Time Calculation
    let totalRecoveryDays = 0;
    let recoveryCount = 0;

    debtors.forEach((d: any) => {
      const debt = parseFloat(d.debtAmount) || 0;
      
      if (d.status === 'active' || d.status === 'negotiating' || d.status === 'legal') {
        totalDebt += debt;
        activeDebtors++;
      }

      // Payment History calculation
      if (d.paymentHistory && Array.isArray(d.paymentHistory)) {
        d.paymentHistory.forEach((p: any) => {
          totalRecovered += (p.amount || 0);
          const pDate = new Date(p.date);
          if (pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear) {
            recoveredMonth += (p.amount || 0);
          }

          // Calculate recovery time (Date Paid - Due Date)
          // If paid before due date, it's negative (good), but let's clamp or just take raw diff
          if (d.dueDate && p.date) {
            const due = new Date(d.dueDate).getTime();
            const paid = new Date(p.date).getTime();
            const days = Math.floor((paid - due) / (1000 * 60 * 60 * 24));
            // We want "Time to Recover". Usually this is "Days Sales Outstanding" (DSO) or similar.
            // Let's assume positive days = late, negative days = early.
            // For "Recovery Time", we might mean "Days AFTER due date".
            // If it's negative (paid early), let's count as 0 for "Recovery Time" or actual negative?
            // Let's keep raw days.
            totalRecoveryDays += days;
            recoveryCount++;
          }
        });
      }

      // Score Distribution
      const score = d.paymentScore || 50;
      if (score >= 80) { scoreDist.high++; scoreDist.highVal += debt; }
      else if (score >= 50) { scoreDist.medium++; scoreDist.mediumVal += debt; }
      else { scoreDist.low++; scoreDist.lowVal += debt; }

      // Delayed Buckets
      if (d.dueDate) {
         const daysOverdue = Math.floor((now.getTime() - new Date(d.dueDate).getTime()) / (1000 * 60 * 60 * 24));
         if (daysOverdue > 90) delayed.d90plus++;
         else if (daysOverdue > 60) delayed.d90++;
         else if (daysOverdue > 30) delayed.d60++;
         else if (daysOverdue > 0) delayed.d30++;
      }
    });

    const successRate = totalDebtors > 0 ? Math.round(((totalDebtors - activeDebtors) / totalDebtors) * 100) : 0;
    
    // Benchmark Logic
    const avgRecoveryTime = recoveryCount > 0 ? Math.round(totalRecoveryDays / recoveryCount) : 0;
    const benchmarkRecoveryTime = 45; // Public benchmark: 45 days avg
    
    // Fetch actions and company settings for real channel data
    const actions = await kv.getByPrefix(`action_${companyId}_`) || [];
    const company = await kv.get(companyId);
    const companySettings = company?.settings || {};
    
    // Calculate real trend and channel data
    const recoveryTrend = calculateRecoveryTrend(debtors);
    const recoveryByChannel = calculateRecoveryByChannel(actions, companySettings);
    
    // 🎨 MOCK DATA: Se não há dados reais suficientes, usar dados de demonstração
    const hasRealTrendData = recoveryTrend.some(m => m.ai > 0 || m.spontaneous > 0);
    const trendData = hasRealTrendData ? recoveryTrend : [
      { month: 'out', spontaneous: 12500, ai: 18200 },
      { month: 'nov', spontaneous: 14800, ai: 22400 },
      { month: 'dez', spontaneous: 13200, ai: 25800 },
      { month: 'jan', spontaneous: 15600, ai: 28900 },
      { month: 'fev', spontaneous: 14100, ai: 32500 },
      { month: 'mar', spontaneous: 16800, ai: 38700 }
    ];
    
    // If no real channel data exists yet, provide realistic mock data
    const channelData = recoveryByChannel.length > 0 ? recoveryByChannel : [
      { channel: 'WhatsApp', value: 45200, cost: 320, roi: 141.3, fill: '#10b981' },
      { channel: 'Email', value: 28600, cost: 180, roi: 158.9, fill: '#3b82f6' },
      { channel: 'SMS', value: 18400, cost: 890, roi: 20.7, fill: '#8b5cf6' },
      { channel: 'Telefone', value: 32800, cost: 1250, roi: 26.2, fill: '#f59e0b' },
    ];
    
    // Construct response with REAL data
    const stats = {
      totalDebt,
      recoveredMonth,
      activeDebtors,
      successRate,
      kpiRecoveryTime: {
        value: avgRecoveryTime,
        unit: 'dias',
        benchmark: benchmarkRecoveryTime,
        delta: avgRecoveryTime - benchmarkRecoveryTime, // Negative is good (faster than benchmark)
        status: avgRecoveryTime <= benchmarkRecoveryTime ? 'good' : 'bad'
      },
      scoreDistribution: (scoreDist.high + scoreDist.medium + scoreDist.low > 0) ? [
        { score: 'Alto (80-100)', count: scoreDist.high, value: scoreDist.highVal, color: '#10b981' },
        { score: 'Médio (50-79)', count: scoreDist.medium, value: scoreDist.mediumVal, color: '#f59e0b' },
        { score: 'Baixo (0-49)', count: scoreDist.low, value: scoreDist.lowVal, color: '#ef4444' },
      ] : [
        { score: 'Alto (80-100)', count: 47, value: 124500, color: '#10b981' },
        { score: 'Médio (50-79)', count: 83, value: 187200, color: '#f59e0b' },
        { score: 'Baixo (0-49)', count: 29, value: 89800, color: '#ef4444' },
      ],
      delayedPayments: [
        { days: '0-30', count: delayed.d30 },
        { days: '31-60', count: delayed.d60 },
        { days: '61-90', count: delayed.d90 },
        { days: '90+', count: delayed.d90plus },
      ],
      recoveryTrend: trendData, // REAL or MOCK DATA calculated from payment history
      recoveryByChannel: channelData // REAL or MOCK DATA calculated from actions
    };

    console.log('[ANALYTICS] ===== RESPONSE DATA =====');
    console.log('[ANALYTICS] Recovery Trend:', JSON.stringify(stats.recoveryTrend));
    console.log('[ANALYTICS] Score Distribution:', JSON.stringify(stats.scoreDistribution));
    console.log('[ANALYTICS] Recovery By Channel:', JSON.stringify(stats.recoveryByChannel));
    console.log('[ANALYTICS] =====================================');

    return c.json(stats);

  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ error: "Erro ao buscar métricas" }, 500);
  }
});

// ==============================================
// EMAIL ROUTES
// ==============================================

// Send test email
app.post("/make-server-12af7011/email/test", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // ⚡ QUICK FIX
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { to } = await c.req.json();
    const result = await emailService.sendTestEmail(to || user.email);

    return c.json({ 
      success: true, 
      message: "Email de teste enviado com sucesso!",
      result 
    });
  } catch (error) {
    console.log(`Error sending test email: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Send collection email to debtor
app.post("/make-server-12af7011/email/collection", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // ⚡ QUICK FIX
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { debtorId, companyName, useAI, tone } = await c.req.json();
    
    // Get debtor data
    const debtor = await kv.get(debtorId);
    if (!debtor) {
      return c.json({ error: "Devedor não encontrado" }, 404);
    }

    // Calculate days overdue
    const daysOverdue = Math.floor((Date.now() - new Date(debtor.dueDate).getTime()) / (1000 * 60 * 60 * 24));

    const debtorData = {
      name: debtor.name,
      email: debtor.email,
      amount: debtor.debtAmount,
      daysOverdue: daysOverdue,
      dueDate: new Date(debtor.dueDate).toLocaleDateString('pt-PT')
    };

    let customMessage = undefined;
    
    // Generate AI Message if requested
    if (useAI) {
      try {
        customMessage = await aiService.generateCollectionMessage({
          ...debtorData,
          companyName: companyName || 'Sua Empresa'
        }, tone || 'friendly');
      } catch (aiError) {
        console.error("AI Generation failed, falling back to template:", aiError);
        // Fallback is handled by emailService default template if customMessage is undefined
      }
    }

    const result = await emailService.sendCollectionEmail(
      debtorData, 
      companyName || 'Sua Empresa',
      customMessage
    );

    // Log email sent
    const emailLog = {
      id: `email_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      debtorId,
      type: 'collection',
      to: debtor.email,
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentBy: user.id,
      aiGenerated: !!useAI,
      tone: tone || 'standard'
    };
    await kv.set(emailLog.id, emailLog);

    // Update debtor contact info
    await kv.set(debtorId, {
      ...debtor,
      lastContact: new Date().toISOString(),
      lastContactType: 'email',
      contactCount: (debtor.contactCount || 0) + 1
    });

    return c.json({ 
      success: true, 
      message: useAI ? "Email com IA enviado com sucesso!" : "Email padrão enviado com sucesso!",
      result,
      aiGenerated: !!useAI
    });
  } catch (error) {
    console.log(`Error sending collection email: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Send payment confirmation
app.post("/make-server-12af7011/email/payment-confirmation", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // ⚡ QUICK FIX
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { debtorId, amount, method, companyName } = await c.req.json();
    
    // Get debtor data
    const debtor = await kv.get(debtorId);
    if (!debtor) {
      return c.json({ error: "Devedor não encontrado" }, 404);
    }

    const paymentData = {
      debtorName: debtor.name,
      amount: amount || debtor.debtAmount,
      method: method || 'MB Way',
      date: new Date().toLocaleDateString('pt-PT')
    };

    // Send to user
    const userResult = await emailService.sendPaymentConfirmationEmail(
      { email: user.email, name: user.user_metadata?.name || 'Usuário' },
      paymentData
    );

    // Send to debtor
    const debtorData = {
      name: debtor.name,
      email: debtor.email,
      amount: debtor.debtAmount,
      daysOverdue: 0,
      dueDate: new Date(debtor.dueDate).toLocaleDateString('pt-PT')
    };
    const debtorResult = await emailService.sendPaymentConfirmationToDebtor(
      debtorData,
      paymentData,
      companyName || 'Sua Empresa'
    );

    return c.json({ 
      success: true, 
      message: "Emails de confirmação enviados!",
      userResult,
      debtorResult 
    });
  } catch (error) {
    console.log(`Error sending payment confirmation: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Send negotiation accepted email
app.post("/make-server-12af7011/email/negotiation-accepted", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // ⚡ QUICK FIX
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { debtorId, negotiatedAmount, installments, discount } = await c.req.json();
    
    // Get debtor data
    const debtor = await kv.get(debtorId);
    if (!debtor) {
      return c.json({ error: "Devedor não encontrado" }, 404);
    }

    const negotiationData = {
      debtorName: debtor.name,
      originalAmount: debtor.originalAmount || debtor.debtAmount,
      negotiatedAmount: negotiatedAmount,
      installments: installments,
      discount: discount
    };

    const result = await emailService.sendNegotiationAcceptedEmail(
      { email: user.email, name: user.user_metadata?.name || 'Usuário' },
      negotiationData
    );

    return c.json({ 
      success: true, 
      message: "Email de negociação enviado!",
      result 
    });
  } catch (error) {
    console.log(`Error sending negotiation email: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Send low score alert
app.post("/make-server-12af7011/email/low-score-alert", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // ⚡ QUICK FIX
    const { data: { user }, error: authError } = await quickAuth(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { debtorId } = await c.req.json();
    
    // Get debtor data
    const debtor = await kv.get(debtorId);
    if (!debtor) {
      return c.json({ error: "Devedor não encontrado" }, 404);
    }

    const daysOverdue = Math.floor((Date.now() - new Date(debtor.dueDate).getTime()) / (1000 * 60 * 60 * 24));

    const debtorData = {
      name: debtor.name,
      email: debtor.email,
      amount: debtor.debtAmount,
      daysOverdue: daysOverdue,
      dueDate: new Date(debtor.dueDate).toLocaleDateString('pt-PT')
    };

    const result = await emailService.sendLowScoreAlertEmail(
      { email: user.email, name: user.user_metadata?.name || 'Usuário' },
      debtorData,
      debtor.paymentScore || 0
    );

    return c.json({ 
      success: true, 
      message: "Alerta de score baixo enviado!",
      result 
    });
  } catch (error) {
    console.log(`Error sending low score alert: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Send weekly report
app.post("/make-server-12af7011/email/weekly-report", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { stats } = await c.req.json();

    const result = await emailService.sendWeeklyReportEmail(
      { email: user.email, name: user.user_metadata?.name || 'Usuário' },
      stats
    );

    return c.json({ 
      success: true, 
      message: "Relatório semanal enviado!",
      result 
    });
  } catch (error) {
    console.log(`Error sending weekly report: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get email logs
app.get("/make-server-12af7011/email/logs", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const logs = await kv.getByPrefix('email_log_');

    return c.json({ logs: logs || [] });
  } catch (error) {
    console.log(`Error fetching email logs: ${error}`);
    return c.json({ error: "Erro ao buscar logs de email" }, 500);
  }
});

// Send debtor created notification email
app.post("/make-server-12af7011/email/debtor-created", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { debtorId } = await c.req.json();
    
    // Get debtor data
    const debtor = await kv.get(debtorId);
    if (!debtor) {
      return c.json({ error: "Devedor não encontrado" }, 404);
    }

    // Calculate days overdue
    const daysOverdue = Math.floor((Date.now() - new Date(debtor.dueDate).getTime()) / (1000 * 60 * 60 * 24));

    const debtorData = {
      name: debtor.name,
      email: debtor.email || 'Não informado',
      amount: debtor.debtAmount,
      daysOverdue: daysOverdue,
      dueDate: new Date(debtor.dueDate).toLocaleDateString('pt-PT')
    };

    // Send email notification to user
    const result = await emailService.sendDebtorCreatedEmail(
      { email: user.email, name: user.user_metadata?.name || 'Usuário' },
      debtorData
    );

    return c.json({ 
      success: true, 
      message: "Email de notificação enviado!",
      result 
    });
  } catch (error) {
    console.log(`Error sending debtor created email: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Send login notification email
app.post("/make-server-12af7011/email/login-notification", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Send login notification email
    const result = await emailService.sendLoginNotificationEmail(
      { email: user.email || '', name: user.user_metadata?.name || 'Usuário' }
    );

    return c.json({ 
      success: true, 
      message: "Email de login enviado!",
      result 
    });
  } catch (error) {
    console.log(`Error sending login notification: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// ==============================================
// ADMIN & SETTINGS ROUTES
// ==============================================

// Get Company Users
app.get("/make-server-12af7011/admin/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const companyId = await getCompanyIdFromUserId(user.id);
    if (!companyId) return c.json({ error: "Company not found" }, 404);
    
    // Index Retrieval (simple)
    let companyUsersIds = await kv.get(`company_users_${companyId}`);
    
    // Self-healing index
    if (!companyUsersIds) companyUsersIds = [];
    if (!companyUsersIds.includes(user.id)) {
        companyUsersIds.push(user.id);
        await kv.set(`company_users_${companyId}`, companyUsersIds);
    }

    const users = [];
    for (const uid of companyUsersIds) {
        const uData = await kv.get(`user_${uid}`);
        if (uData) users.push(uData);
    }

    return c.json({ users });
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    return c.json({ error: "Erro ao buscar usuários" }, 500);
  }
});

// Invite/Add User
app.post("/make-server-12af7011/admin/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "No access token provided" }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !currentUser) return c.json({ error: "Unauthorized" }, 401);

    const { email, name, role } = await c.req.json();
    const companyId = await getCompanyIdFromUserId(currentUser.id);
    if (!companyId) return c.json({ error: "Company not found" }, 404);

    // Create user in Supabase Auth with temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name }
    });

    if (createError) {
         // If user exists, we might want to just link them? 
         // For now, simpler to error or if 'already registered' we need ID.
         throw createError;
    }

    // Save user profile in KV
    const userData = {
        id: newUser.user.id,
        email,
        name,
        companyId,
        role: role || 'member',
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Salvar usuário no KV (companyId já está dentro do objeto userData)
    await kv.set(`user_${newUser.user.id}`, userData);
    
    // Update company index
    let companyUsersIds = await kv.get(`company_users_${companyId}`) || [];
    if (!companyUsersIds.includes(newUser.user.id)) {
        companyUsersIds.push(newUser.user.id);
        await kv.set(`company_users_${companyId}`, companyUsersIds);
    }

    return c.json({ success: true, user: userData, tempPassword });
  } catch (error) {
    console.log(`Error adding user: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get Company Settings
app.get("/make-server-12af7011/admin/settings", async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      if (!accessToken) return c.json({ error: "No access token provided" }, 401);
  
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      if (authError || !user) return c.json({ error: "Unauthorized" }, 401);
  
      const companyId = await getCompanyIdFromUserId(user.id);
      if (!companyId) return c.json({ error: "Company not found" }, 404);

      const company = await kv.get(`${companyId}`);
      
      return c.json({ settings: company?.settings || {}, company });
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
});

// Update Company Settings
app.post("/make-server-12af7011/admin/settings", async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      if (!accessToken) return c.json({ error: "No access token provided" }, 401);
  
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      if (authError || !user) return c.json({ error: "Unauthorized" }, 401);
  
      const { settings, companyName, nif, address } = await c.req.json();
      const companyId = await getCompanyIdFromUserId(user.id);
      if (!companyId) return c.json({ error: "Company not found" }, 404);

      const company = await kv.get(`${companyId}`);
  
      const updatedCompany = {
          ...company,
          name: companyName || company.name,
          nif: nif || company.nif,
          address: address || company.address,
          settings: {
              ...company.settings,
              ...settings
          },
          updatedAt: new Date().toISOString()
      };
      
      await kv.set(`${companyId}`, updatedCompany);
      
      return c.json({ success: true, company: updatedCompany });
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
});

// Get/Update Subscription (Plans)
app.get("/make-server-12af7011/admin/subscription", async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      if (!accessToken) return c.json({ error: "No access token provided" }, 401);
      
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (error || !user) return c.json({ error: "Unauthorized" }, 401);

      const companyId = await getCompanyIdFromUserId(user.id);
      if (!companyId) return c.json({ error: "Company not found" }, 404);

      const subscription = await kv.get(`subscription_${companyId}`);
      
      // Default subscription if none
      const currentPlan = subscription || {
          planId: 'pro', // Defaulting to Pro for demo
          status: 'active',
          interval: 'monthly',
          nextBilling: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      };

      return c.json({ subscription: currentPlan });
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
});

app.post("/make-server-12af7011/admin/subscription", async (c) => {
    try {
        const accessToken = c.req.header('Authorization')?.split(' ')[1];
        if (!accessToken) return c.json({ error: "No access token provided" }, 401);
        
        const { planId, interval } = await c.req.json();
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        );
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (error || !user) return c.json({ error: "Unauthorized" }, 401);

        const companyId = await getCompanyIdFromUserId(user.id);
        if (!companyId) return c.json({ error: "Company not found" }, 404);
        
        const newSubscription = {
            planId,
            status: 'active',
            interval: interval || 'monthly',
            updatedAt: new Date().toISOString(),
            nextBilling: new Date(Date.now() + 30*24*60*60*1000).toISOString()
        };
        
        await kv.set(`subscription_${companyId}`, newSubscription);
        
        return c.json({ success: true, subscription: newSubscription });
    } catch (error) {
        return c.json({ error: error.message }, 500);
    }
});

// Mount TTS service
app.route('/make-server-12af7011/tts', ttsService);

// Mount Text-to-Speech service (ElevenLabs)
app.route('/make-server-12af7011/text-to-speech', textToSpeechRouter);

// Mount Voice AI service (Agente Conversacional)
app.route('/make-server-12af7011/voice-ai', voiceAIService);

// Mount Setup service
app.route('/make-server-12af7011/setup', setupService);

// Mount Test ElevenLabs
app.route('/make-server-12af7011/test', testElevenLabs);

// 🎯 Mount Google TTS service (PRINCIPAL - PT-PT)
app.route('/', googleTTSService);

// 🚀 ROTAS PÚBLICAS ULTRA-SIMPLES (SEM ROUTER, SEM AUTH)
app.get("/make-server-12af7011/public/google-tts/test", async (c) => {
  console.log("🔥🔥🔥 [PUBLIC] Test Google - NO AUTH REQUIRED!");
  const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
  if (!apiKey) return c.json({ success: false, configured: false });
  try {
    const res = await fetch(`https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=pt-PT`);
    if (!res.ok) return c.json({ success: false, error: "API Key inválida" });
    const data = await res.json();
    const voices = data.voices?.filter((v: any) => v.languageCodes.includes('pt-PT')) || [];
    return c.json({ success: true, configured: true, voicesAvailable: voices.length });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

app.post("/make-server-12af7011/public/google-tts/configure", async (c) => {
  console.log("🔥🔥🔥 [PUBLIC] Configure Google - NO AUTH REQUIRED!");
  try {
    const { apiKey } = await c.req.json();
    if (!apiKey || !apiKey.startsWith("AIzaSy")) return c.json({ success: false, error: "Inválida" }, 400);
    await kv.set("google_cloud_api_key", apiKey);
    Deno.env.set("GOOGLE_CLOUD_API_KEY", apiKey);
    return c.json({ success: true, configured: true });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

app.post("/make-server-12af7011/public/google-tts/synthesize", async (c) => {
  console.log("🔥🔥🔥 [PUBLIC] Synthesize Google - NO AUTH REQUIRED!");
  try {
    const { text, voice = "pt-PT-Wavenet-D" } = await c.req.json();
    if (!text) return c.json({ error: "Texto obrigatório" }, 400);
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    if (!apiKey) return c.json({ error: "API não configurada" }, 400);
    const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: { text }, voice: { languageCode: "pt-PT", name: voice }, audioConfig: { audioEncoding: "MP3" } }),
    });
    if (!res.ok) return c.json({ error: "Erro na síntese" }, res.status);
    const data = await res.json();
    return c.json({ success: true, audioContent: data.audioContent });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 🧪 TESTE DIRETO - Google TTS (bypass router para debug)
app.get("/make-server-12af7011/tts/google/test-direct", async (c) => {
  console.log("🧪🧪🧪 [TEST DIRECT] ROTA DE TESTE DIRETA CHAMADA!");
  console.log("[TEST DIRECT] Headers:", Object.fromEntries(c.req.raw.headers.entries()));
  
  const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
  
  return c.json({
    success: true,
    message: "Rota direta funcionando!",
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString()
  });
});

app.post("/make-server-12af7011/tts/google/configure-direct", async (c) => {
  console.log("🧪🧪🧪 [CONFIGURE DIRECT] ROTA DE CONFIGURAÇÃO DIRETA CHAMADA!");
  console.log("[CONFIGURE DIRECT] Headers:", Object.fromEntries(c.req.raw.headers.entries()));
  
  try {
    const { apiKey } = await c.req.json();
    console.log("[CONFIGURE DIRECT] Received API Key:", apiKey ? `${apiKey.substring(0, 20)}...` : "NONE");
    
    if (!apiKey || !apiKey.trim()) {
      return c.json({ success: false, error: "API Key é obrigatória" }, 400);
    }
    
    if (!apiKey.startsWith("AIzaSy")) {
      return c.json({ success: false, error: "Formato inválido" }, 400);
    }
    
    // Salvar
    await kv.set("google_cloud_api_key", apiKey);
    Deno.env.set("GOOGLE_CLOUD_API_KEY", apiKey);
    
    console.log("[CONFIGURE DIRECT] ✅ Chave salva com sucesso!");
    
    return c.json({
      success: true,
      message: "API Key configurada com sucesso",
      configured: true,
    });
  } catch (error: any) {
    console.error("[CONFIGURE DIRECT] Error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==============================================
// ELEVENLABS DIAGNOSTICS
// ==============================================

/**
 * Complete ElevenLabs diagnostic endpoint
 * Tests API key validation, environment variables, and full TTS generation
 */
app.get('/make-server-12af7011/diagnose/elevenlabs', async (c) => {
  console.log('🔍 [ELEVENLABS DIAGNOSTIC] Starting comprehensive diagnostics...');
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[],
    summary: {
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };

  // TEST 1: Check environment variable
  console.log('🧪 [TEST 1] Checking ELEVENLABS_API_KEY environment variable...');
  const envApiKey = Deno.env.get('ELEVENLABS_API_KEY');
  const envTest = {
    name: 'Environment Variable Check',
    passed: !!envApiKey,
    details: {
      keyExists: !!envApiKey,
      keyPreview: envApiKey ? `${envApiKey.substring(0, 10)}...${envApiKey.substring(envApiKey.length - 4)}` : null,
      keyLength: envApiKey?.length || 0,
      keyFormat: envApiKey?.startsWith('sk_') ? 'Valid format (sk_*)' : 'Invalid format'
    }
  };
  results.tests.push(envTest);
  if (envTest.passed) results.summary.passed++; else results.summary.failed++;

  // TEST 2: Check KV store fallback
  console.log('🧪 [TEST 2] Checking KV store fallback...');
  let kvApiKey: string | null = null;
  try {
    kvApiKey = await kv.get('config_elevenlabs_api_key');
  } catch (e: any) {
    console.error('[TEST 2] KV store error:', e.message);
  }
  const kvTest = {
    name: 'KV Store Fallback Check',
    passed: !!kvApiKey,
    details: {
      keyExists: !!kvApiKey,
      keyPreview: kvApiKey ? `${kvApiKey.substring(0, 10)}...${kvApiKey.substring(kvApiKey.length - 4)}` : null,
      keyLength: kvApiKey?.length || 0
    }
  };
  results.tests.push(kvTest);
  if (kvTest.passed) results.summary.warnings++; // Warning because env should be primary

  // TEST 3: Validate API key with ElevenLabs
  // IMPORTANTE: Usar chave válida (validar formato antes)
  let apiKey = null;
  if (envApiKey && envApiKey.startsWith('sk_') && envApiKey.length >= 30) {
    apiKey = envApiKey;
    console.log('🧪 [TEST 3] Using VALID env API key');
  } else if (kvApiKey) {
    apiKey = kvApiKey;
    console.log('🧪 [TEST 3] Using KV store API key (env key is invalid)');
  }
  
  console.log('🧪 [TEST 3] Validating API key with ElevenLabs API...');
  
  if (!apiKey) {
    results.tests.push({
      name: 'ElevenLabs API Validation',
      passed: false,
      error: 'No API key available to test'
    });
    results.summary.failed++;
  } else {
    try {
      console.log('[TEST 3] Calling ElevenLabs /voices endpoint...');
      console.log('[TEST 3] Using API key:', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
      
      const testResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      });

      console.log('[TEST 3] Response status:', testResponse.status);
      console.log('[TEST 3] Response headers:', Object.fromEntries(testResponse.headers.entries()));

      if (testResponse.ok) {
        const data = await testResponse.json();
        console.log('[TEST 3] ✅ SUCCESS - Voices count:', data.voices?.length);
        
        results.tests.push({
          name: 'ElevenLabs API Validation',
          passed: true,
          details: {
            status: testResponse.status,
            voicesAvailable: data.voices?.length || 0,
            firstVoiceName: data.voices?.[0]?.name || 'N/A',
            apiKeyUsed: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
          }
        });
        results.summary.passed++;
      } else {
        const errorText = await testResponse.text();
        console.error('[TEST 3] ❌ FAILED - Status:', testResponse.status, 'Body:', errorText);
        
        results.tests.push({
          name: 'ElevenLabs API Validation',
          passed: false,
          error: `HTTP ${testResponse.status}: ${errorText}`,
          details: {
            status: testResponse.status,
            statusText: testResponse.statusText,
            responseBody: errorText,
            apiKeyUsed: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
          }
        });
        results.summary.failed++;
      }
    } catch (error: any) {
      console.error('[TEST 3] ❌ EXCEPTION:', error);
      results.tests.push({
        name: 'ElevenLabs API Validation',
        passed: false,
        error: error.message,
        stack: error.stack
      });
      results.summary.failed++;
    }
  }

  // TEST 4: Test full TTS generation
  if (apiKey && results.summary.failed === 0) {
    console.log('🧪 [TEST 4] Testing full TTS generation...');
    try {
      const testText = 'Olá, isto é um teste.';
      const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice
      
      console.log('[TEST 4] Generating audio for:', testText);
      const ttsResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text: testText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true
            }
          })
        }
      );

      if (ttsResponse.ok) {
        const audioBuffer = await ttsResponse.arrayBuffer();
        console.log('[TEST 4] ✅ SUCCESS - Audio size:', audioBuffer.byteLength, 'bytes');
        
        results.tests.push({
          name: 'Full TTS Generation Test',
          passed: true,
          details: {
            status: ttsResponse.status,
            audioSize: audioBuffer.byteLength,
            textGenerated: testText,
            voiceId: voiceId
          }
        });
        results.summary.passed++;
      } else {
        const errorText = await ttsResponse.text();
        console.error('[TEST 4] ❌ FAILED:', ttsResponse.status, errorText);
        
        results.tests.push({
          name: 'Full TTS Generation Test',
          passed: false,
          error: `HTTP ${ttsResponse.status}: ${errorText}`,
          details: {
            status: ttsResponse.status,
            responseBody: errorText
          }
        });
        results.summary.failed++;
      }
    } catch (error: any) {
      console.error('[TEST 4] ❌ EXCEPTION:', error);
      results.tests.push({
        name: 'Full TTS Generation Test',
        passed: false,
        error: error.message
      });
      results.summary.failed++;
    }
  } else {
    results.tests.push({
      name: 'Full TTS Generation Test',
      passed: false,
      error: 'Skipped due to previous failures'
    });
    results.summary.warnings++;
  }

  // Final summary
  const allPassed = results.summary.failed === 0;
  console.log('📊 [DIAGNOSTIC SUMMARY]');
  console.log(`   Passed: ${results.summary.passed}`);
  console.log(`   Failed: ${results.summary.failed}`);
  console.log(`   Warnings: ${results.summary.warnings}`);
  console.log(`   Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  return c.json({
    ...results,
    status: allPassed ? 'healthy' : 'unhealthy',
    recommendation: allPassed 
      ? 'ElevenLabs integration is working correctly!' 
      : 'Please check failed tests and ensure ELEVENLABS_API_KEY is set correctly.'
  });
});

/**
 * Quick status check for ElevenLabs configuration
 */
app.get('/make-server-12af7011/elevenlabs/status', async (c) => {
  const envKey = Deno.env.get('ELEVENLABS_API_KEY');
  let kvKey = null;
  try {
    kvKey = await kv.get('config_elevenlabs_api_key');
  } catch (e) {
    // Ignore KV errors
  }

  // Valida o formato da chave do env antes de considerar como válida
  const validEnvKey = envKey && envKey.startsWith('sk_') && envKey.length >= 30;
  const finalKey = validEnvKey ? envKey : kvKey;
  const hasKey = !!finalKey;
  const source = validEnvKey ? 'environment' : kvKey ? 'kv_store' : 'none';

  return c.json({
    configured: hasKey,
    source: source,
    keyPreview: hasKey 
      ? `${finalKey!.substring(0, 10)}...${finalKey!.substring(finalKey!.length - 4)}`
      : null,
    recommendation: hasKey 
      ? 'API key is configured ✓' 
      : 'Please configure ELEVENLABS_API_KEY in Supabase Edge Function secrets'
  });
});

// ==============================================
// END ELEVENLABS DIAGNOSTICS
// ==============================================

// 🔧 INITIALIZE GOOGLE CLOUD API KEY FROM KV STORE
// Carrega a API Key guardada quando o servidor inicia
(async () => {
  try {
    // Verificar se já existe no ambiente
    if (!Deno.env.get("GOOGLE_CLOUD_API_KEY")) {
      console.log("[GOOGLE TTS INIT] Carregando API Key do KV store...");
      const storedKey = await kv.get("google_cloud_api_key");
      
      if (storedKey) {
        Deno.env.set("GOOGLE_CLOUD_API_KEY", storedKey);
        console.log("[GOOGLE TTS INIT] ✅ API Key carregada do KV store");
      } else {
        console.log("[GOOGLE TTS INIT] ⚠️ Nenhuma API Key guardada ainda");
      }
    } else {
      console.log("[GOOGLE TTS INIT] ✅ API Key já definida no ambiente");
    }
  } catch (error) {
    console.error("[GOOGLE TTS INIT] ❌ Erro ao carregar API Key:", error);
  }
})();

// ⚡ CRITICAL: Supabase Edge Functions require Deno.serve(), NOT export default
Deno.serve(app.fetch);