import { supabase, API_URL, getAuthHeaders } from './supabase';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      // Traduzir erro comum
      if (error.message === "Invalid login credentials") {
        return { success: false, error: "Email ou senha incorretos." };
      }
      if (error.message.includes("Email not confirmed")) {
        return { 
          success: false, 
          error: "Email não confirmado.",
          details: "Se você acabou de criar a conta, verifique se usou um email válido. Se o erro persistir, tente criar uma nova conta com outro email." 
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Login exception:", error);
    return { success: false, error: error.message };
  }
}

export async function signUp(email: string, password: string, companyName: string, userName: string) {
  try {
    console.log("Iniciando cadastro...");
    
    // 1. Tentar criar via servidor (método preferido - auto confirmação)
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password, companyName, userName }),
      });

      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error("Erro JSON:", text);
        throw new Error("Resposta inválida do servidor");
      }

      if (!res.ok) {
        // Se o servidor retornou um erro específico, NÃO FAZER FALLBACK.
        // O servidor sabe o que está fazendo (ex: usuário já existe, senha fraca).
        // Se fizermos fallback, podemos criar estados inconsistentes.
        if (data && data.error) {
           throw new Error(`Server: ${data.error}`);
        }
        throw new Error(data.error || `Erro: ${res.status}`);
      }

      console.log("Cadastro via servidor com sucesso!");
      
      // Login automático
      const loginResult = await signIn(email, password);
      if (loginResult.success) {
        return { success: true, data: loginResult.data };
      }
      
      return { success: true, requireLogin: true };

    } catch (serverError: any) {
      // Se o erro veio explicitamente do servidor, repassar para o usuário
      if (serverError.message.startsWith("Server:")) {
         return { success: false, error: serverError.message.replace("Server: ", "") };
      }

      console.warn("Falha de conexão com servidor, tentando fallback local:", serverError.message);
      
      // 2. Fallback: Criar via cliente APENAS se for erro de rede/infra
      // ...
      
      // ⚠️ DESATIVADO: Fallback cria usuários com email não confirmado.
      // Em ambiente sem SMTP, isso bloqueia o usuário.
      // Melhor exibir o erro do servidor para debug.
      
      /*
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            full_name: userName,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          return { success: false, error: "Este email já possui conta." };
        }
        return { success: false, error: error.message };
      }

      if (data.session) {
        return { success: true, data };
      } else if (data.user) {
        return { 
          success: true, 
          requireConfirmation: true, 
          message: "Conta criada! Verifique seu email para confirmar." 
        };
      }
      */

      return { 
        success: false, 
        error: `Erro no servidor: ${serverError.message}. O cadastro automático falhou.` 
      };

    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro inesperado' };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}
