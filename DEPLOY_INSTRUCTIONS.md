# Guia de Configuração do Deploy Automático (CI/CD)

Para que o pipeline de deploy automático funcione, você precisa configurar os **Segredos (Secrets)** no seu repositório GitHub.

## 1. Obter Credenciais da Vercel

Você precisará de 3 informações da sua conta Vercel:

1.  **VERCEL_TOKEN**: Gere um token em https://vercel.com/account/tokens
2.  **VERCEL_ORG_ID**: Encontre no arquivo `.vercel/project.json` (se tiver a CLI rodada localmente) ou nas configurações gerais da sua conta/time na Vercel.
3.  **VERCEL_PROJECT_ID**: Encontre nas configurações do projeto na Vercel (Settings > General > Project ID).

## 2. Configurar no GitHub

1.  Vá para a página do seu repositório no GitHub.
2.  Clique na aba **Settings** (Configurações).
3.  No menu lateral esquerdo, clique em **Secrets and variables** > **Actions**.
4.  Clique no botão verde **New repository secret**.
5.  Adicione os seguintes segredos (nomes exatos):

| Nome do Segredo | Valor |
|-------------------|-------|
| `VERCEL_TOKEN` | *Seu token gerado no passo 1* |
| `VERCEL_ORG_ID` | *Seu ID de Organização* |
| `VERCEL_PROJECT_ID` | *Seu ID de Projeto* |
| `VITE_SENTRY_DSN` | *(Opcional) Sua URL de DSN do Sentry para monitoramento de erros* |

## 3. Testar

Assim que adicionar os segredos, faça qualquer alteração no código (mesmo que pequena) e dê um `push` para a branch `main`.
Vá na aba **Actions** do GitHub para ver o pipeline rodando e o deploy acontecendo automaticamente!
