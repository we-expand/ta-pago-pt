import * as kv from "./kv_store.tsx";

// Tipos básicos do WebAuthn
interface Credential {
  id: string;
  publicKey: string;
  counter: number;
  transports?: string[];
}

interface Challenge {
  challenge: string;
  timestamp: number;
}

// Gerar challenge aleatório
function generateChallenge(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Base64url encode
function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Gerar opções de registro
export async function generateRegistrationOptions(userId: string, userName: string, rpID: string) {
  const challenge = generateChallenge();
  
  // Salvar challenge
  await kv.set(`webauthn_challenge_${userId}`, {
    challenge,
    timestamp: Date.now()
  });

  return {
    challenge: base64urlEncode(new TextEncoder().encode(challenge).buffer),
    rp: {
      name: "Tá Pago.pt",
      id: rpID
    },
    user: {
      id: userId,
      name: userName,
      displayName: userName
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },  // ES256
      { type: "public-key", alg: -257 } // RS256
    ],
    timeout: 60000,
    attestation: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      requireResidentKey: false,
      userVerification: "preferred"
    }
  };
}

// Verificar registro
export async function verifyRegistration(userId: string, response: any, rpID: string, origin: string) {
  // Buscar challenge
  const storedChallenge = await kv.get(`webauthn_challenge_${userId}`);
  if (!storedChallenge) {
    throw new Error('Challenge not found or expired');
  }

  // Validar challenge (simplificado)
  if (response.response.clientDataJSON) {
    // Salvar credencial
    const credential: Credential = {
      id: base64urlEncode(response.rawId),
      publicKey: base64urlEncode(response.response.attestationObject),
      counter: 0,
      transports: response.response.transports
    };

    await kv.set(`webauthn_credential_${userId}`, credential);
    await kv.set(`webauthn_credential_id_to_user_${credential.id}`, userId); // Store mapping
    await kv.del(`webauthn_challenge_${userId}`);

    return { verified: true };
  }

  return { verified: false };
}

// Gerar opções de autenticação
export async function generateAuthenticationOptions(userId: string, rpID: string) {
  const challenge = generateChallenge();
  
  // Salvar challenge
  await kv.set(`webauthn_auth_challenge_${userId}`, {
    challenge,
    timestamp: Date.now()
  });

  // Buscar credenciais do usuário
  const credential = await kv.get(`webauthn_credential_${userId}`);
  
  const allowCredentials = credential ? [{
    type: "public-key",
    id: credential.id,
    transports: credential.transports || ["internal"]
  }] : [];

  return {
    challenge,
    timeout: 60000,
    rpId: rpID,
    allowCredentials,
    userVerification: "preferred"
  };
}

// 🔐 Gerar opções de LOGIN (sem userId - busca todas as credenciais)
export async function generateLoginOptions(rpID: string) {
  const challenge = generateChallenge();
  
  // Salvar challenge global
  await kv.set(`webauthn_login_challenge_${challenge}`, {
    challenge,
    timestamp: Date.now()
  });

  return {
    challenge,
    timeout: 60000,
    rpId: rpID,
    userVerification: "preferred"
  };
}

// Verificar autenticação
export async function verifyAuthentication(userId: string, response: any, rpID: string, origin: string) {
  // Buscar challenge
  const storedChallenge = await kv.get(`webauthn_auth_challenge_${userId}`);
  if (!storedChallenge) {
    throw new Error('Challenge not found or expired');
  }

  // Buscar credencial
  const credential = await kv.get(`webauthn_credential_${userId}`);
  if (!credential) {
    throw new Error('No credential found for user');
  }

  // Validar (simplificado para MVP)
  if (response.id === credential.id) {
    await kv.del(`webauthn_auth_challenge_${userId}`);
    return { verified: true };
  }

  return { verified: false };
}

// 🔐 Verificar LOGIN (busca userId pela credencial)
export async function verifyLogin(response: any, rpID: string, origin: string) {
  console.log('[WEBAUTHN SERVICE] Verifying login with credential:', response.id);
  
  // Buscar o challenge da resposta
  // NOTA: O response.response.clientDataJSON contém o challenge
  const clientDataJSON = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(atob(response.response.clientDataJSON.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    )
  );
  
  const challenge = clientDataJSON.challenge;
  console.log('[WEBAUTHN SERVICE] Challenge from response:', challenge);
  
  // Verificar challenge
  const storedChallenge = await kv.get(`webauthn_login_challenge_${challenge}`);
  if (!storedChallenge) {
    console.error('[WEBAUTHN SERVICE] Challenge not found or expired');
    throw new Error('Challenge not found or expired');
  }

  // Buscar userId a partir do credential.id
  const userId = await kv.get(`webauthn_credential_id_to_user_${response.id}`);
  if (!userId) {
    console.error("[WEBAUTHN SERVICE] User ID not found for credential ID:", response.id);
    return { verified: false, userId: null };
  }

  // Buscar a credencial específica do usuário
  const credential = await kv.get(`webauthn_credential_${userId}`);
  if (!credential || credential.id !== response.id) {
    console.error("[WEBAUTHN SERVICE] No matching credential found for user", userId, "with ID", response.id);
    return { verified: false, userId: null };
  }

  console.log("[WEBAUTHN SERVICE] ✅ Found matching credential for user:", userId);
  await kv.del(`webauthn_login_challenge_${challenge}`);
  return { verified: true, userId: userId };
}

// Reset de credenciais
export async function resetUserCredentials(userId: string) {
  const credential = await kv.get(`webauthn_credential_${userId}`);
  if (credential && credential.id) {
    await kv.del(`webauthn_credential_id_to_user_${credential.id}`);
  }
  await kv.del(`webauthn_credential_${userId}`);
  await kv.del(`webauthn_challenge_${userId}`);
  await kv.del(`webauthn_auth_challenge_${userId}`);
}

export const webauthnService = {
  generateRegistrationOptions,
  verifyRegistration,
  generateAuthenticationOptions,
  generateLoginOptions,
  verifyAuthentication,
  verifyLogin,
  resetUserCredentials
};