// ✅ AUTENTICAÇÃO SIMPLES - Apenas decodifica JWT
export async function authenticateUser(accessToken: string): Promise<{ user: any; error: any }> {
  try {
    console.log('[SIMPLE_AUTH] Starting authentication...');
    console.log('[SIMPLE_AUTH] Token received (first 100 chars):', accessToken ? `${accessToken.substring(0, 100)}...` : 'NONE');
    console.log('[SIMPLE_AUTH] Full Token received:', accessToken);
    
    if (!accessToken) {
      console.log('[SIMPLE_AUTH] ❌ No token provided');
      return { user: null, error: { message: 'No token' } };
    }
    
    // Decode JWT
    const parts = accessToken.split('.');
    console.log('[SIMPLE_AUTH] JWT parts:', parts.length);
    
    if (parts.length !== 3) {
      console.log('[SIMPLE_AUTH] ❌ Invalid JWT format');
      return { user: null, error: { message: 'Invalid JWT format' } };
    }
    
    // Base64url decode payload
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    console.log('[SIMPLE_AUTH] Decoding payload...');
    const payload = JSON.parse(atob(base64));
    console.log('[SIMPLE_AUTH] Payload decoded:', {
      sub: payload.sub,
      email: payload.email,
      exp: payload.exp,
      role: payload.role
    });
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    console.log('[SIMPLE_AUTH] Current time (now):', now, 'Payload exp:', payload.exp);
    console.log('[SIMPLE_AUTH] Token expiration check:', { now, exp: payload.exp, expired: payload.exp < now });
    
    if (payload.exp < now) {
      console.log('[SIMPLE_AUTH] ❌ Token expired');
      return { user: null, error: { message: 'Token expired' } };
    }
    
    const user = {
      id: payload.sub,
      email: payload.email,
      phone: payload.phone || '',
      role: payload.role || 'authenticated',
    };
    
    console.log('[SIMPLE_AUTH] ✅ Authentication successful:', user.id);
    
    return {
      user,
      error: null
    };
  } catch (err) {
    console.error('[SIMPLE_AUTH] ❌ Exception:', err);
    return { user: null, error: { message: (err as any).message } };
  }
}