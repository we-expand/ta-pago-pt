import { supabase } from './supabase';
import { projectId, publicAnonKey } from './supabase/info';

interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Sign up a new user
 */
export async function signUp(
  email: string,
  password: string,
  companyName: string,
  userName: string
): Promise<AuthResult> {
  try {
    // Call server endpoint to create user
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email,
          password,
          companyName,
          userName,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Erro ao criar conta',
      };
    }

    // After successful signup, sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return {
        success: false,
        error: 'Conta criada mas erro ao fazer login. Tente fazer login manualmente.',
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar conta',
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : error.message,
      };
    }

    if (!data.session) {
      return {
        success: false,
        error: 'Erro ao criar sessão',
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Signin error:', error);
    return {
      success: false,
      error: error.message || 'Erro ao fazer login',
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Signout error:', error);
    return {
      success: false,
      error: error.message || 'Erro ao fazer logout',
    };
  }
}
