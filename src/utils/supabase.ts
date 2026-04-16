import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

export { projectId, publicAnonKey };

// 🔐 SINGLETON PATTERN - Apenas UMA instância do Supabase Client
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    console.log('🔐 [SUPABASE] Creating NEW singleton instance...');
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
          storageKey: 'sb-tapago-auth',  // ⚡ Chave única para evitar conflitos
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          flowType: 'pkce',  // Fluxo de autenticação mais seguro
        },
        global: {
          headers: {
            'x-application-name': 'tapago-pt'
          }
        }
      }
    );
    console.log('✅ [SUPABASE] Singleton instance created successfully');
  } else {
    console.log('♻️ [SUPABASE] Reusing existing singleton instance');
  }
  return supabaseInstance;
})();

export const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-12af7011`;

// Helper to get auth headers
export function getAuthHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
    'apikey': publicAnonKey  // ⚡ CRITICAL: Supabase Edge Functions requires apikey header
  };
}

// API calls
export async function signUp(email: string, password: string, companyName: string, userName: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password, companyName, userName })
  });
  return await res.json();
}

export async function getSession(token: string) {
  const res = await fetch(`${API_URL}/auth/session`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });
  return await res.json();
}

export async function getDebtors(token: string) {
  const res = await fetch(`${API_URL}/debtors`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });
  return await res.json();
}

export async function createDebtor(token: string, debtor: any) {
  const res = await fetch(`${API_URL}/debtors`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(debtor)
  });
  return await res.json();
}

export async function updateDebtor(token: string, id: string, updates: any) {
  const res = await fetch(`${API_URL}/debtors/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates)
  });
  return await res.json();
}

export async function executeAction(token: string, debtorId: string, channel: string, message: string) {
  const res = await fetch(`${API_URL}/actions/execute`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ debtorId, channel, message })
  });
  return await res.json();
}

export async function getTimeline(token: string, debtorId: string) {
  const res = await fetch(`${API_URL}/debtors/${debtorId}/timeline`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });
  return await res.json();
}

export async function getDashboardMetrics(token: string) {
  const res = await fetch(`${API_URL}/analytics/dashboard`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });
  return await res.json();
}

export async function getSettings(token: string) {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });
  return await res.json();
}

export async function updateSettings(token: string, settings: any) {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(settings)
  });
  return await res.json();
}

export async function suggestAIMessage(token: string, debtorId: string, channel: string, tone: string) {
  const res = await fetch(`${API_URL}/ai/suggest-message`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ debtorId, channel, tone })
  });
  return await res.json();
}

export async function getBestContactTime(token: string, debtorId: string) {
  const res = await fetch(`${API_URL}/ai/best-contact-time`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ debtorId })
  });
  return await res.json();
}

// Register communication action
export async function registerAction(
  token: string, 
  debtorId: string, 
  channel: 'whatsapp' | 'email' | 'sms' | 'voice',
  type: string,
  success: boolean,
  metadata?: { amount?: number; cost?: number; [key: string]: any }
) {
  const res = await fetch(`${API_URL}/actions/register`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ debtorId, channel, type, success, metadata })
  });
  return await res.json();
}

// Helper to get current session token from Supabase
export async function getCurrentSessionToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('[getCurrentSessionToken] Error:', error);
    return null;
  }
}

// Timeline Actions Functions
export async function getTimelineActions(token: string) {
  const res = await fetch(`${API_URL}/timeline`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });
  return await res.json();
}

export async function createTimelineAction(token: string, actionData: any) {
  const res = await fetch(`${API_URL}/timeline`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(actionData)
  });
  return await res.json();
}

export async function updateTimelineAction(token: string, actionId: string, updates: any) {
  const res = await fetch(`${API_URL}/timeline/${actionId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates)
  });
  return await res.json();
}

export async function deleteTimelineAction(token: string, actionId: string) {
  const res = await fetch(`${API_URL}/timeline/${actionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return await res.json();
}

export async function generateMessagePreview(token: string, previewData: any) {
  const res = await fetch(`${API_URL}/timeline/preview`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(previewData)
  });
  return await res.json();
}
