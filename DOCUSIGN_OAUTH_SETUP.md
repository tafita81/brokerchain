# DocuSign OAuth 2.0 Setup Guide

## 🎯 Overview

BrokerChain usa **OAuth 2.0 Authorization Code Grant** para integração com DocuSign. Este é o método recomendado pela DocuSign para aplicações de produção.

## 📋 Credenciais Necessárias

Você precisa configurar as seguintes **secret keys** no Replit:

### 1. DOCUSIGN_INTEGRATION_KEY
- **O que é:** OAuth Client ID (mesma Integration Key usada para JWT)
- **Onde obter:** DocuSign Admin Console → Apps & Keys
- **Exemplo:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### 2. DOCUSIGN_SECRET_KEY
- **O que é:** OAuth Client Secret
- **Onde obter:** DocuSign Admin Console → Apps & Keys → Secret Key
- **⚠️ IMPORTANTE:** Copie e salve imediatamente - aparece apenas uma vez!
- **Exemplo:** `1a2b3c4d-5e6f-7890-abcd-1234567890ab`

### 3. DOCUSIGN_REDIRECT_URI
- **O que é:** URL de callback para onde DocuSign redireciona após autenticação
- **Para desenvolvimento (Replit):** `https://sua-repl-name.username.repl.co/api/docusign/oauth/callback`
- **Para produção:** `https://seu-dominio.com/api/docusign/oauth/callback`
- **⚠️ IMPORTANTE:** Esta URL **deve** estar registrada no DocuSign Admin Console!

### 4. DOCUSIGN_ENV (opcional)
- **O que é:** Ambiente DocuSign
- **Valores:** `sandbox` (default) ou `production`
- **Não é secret:** Pode ser configurada diretamente no código

### 5. DOCUSIGN_ACCOUNT_ID (removida - agora automática)
- ✅ Agora obtida automaticamente via OAuth!

### 6. DOCUSIGN_USER_ID (removida - agora automática)
- ✅ Agora obtida automaticamente via OAuth!

## 🔧 Como Configurar no DocuSign Admin Console

### Passo 1: Criar/Acessar Aplicação OAuth

1. Acesse: https://admindemo.docusign.com/ (sandbox) ou https://admin.docusign.com/ (produção)
2. Navegue: **Apps & Keys** no menu lateral
3. Clique em **ADD APP AND INTEGRATION KEY**
4. Dê um nome (ex: "BrokerChain OAuth")

### Passo 2: Configurar Redirect URI

1. Na tela da aplicação, role até **Redirect URIs**
2. Clique em **+ ADD URI**
3. Adicione: `https://sua-repl-name.username.repl.co/api/docusign/oauth/callback`
4. Clique em **SAVE**

### Passo 3: Gerar Secret Key

1. Role até **Secret Key**
2. Clique em **ADD SECRET KEY**
3. **COPIE IMEDIATAMENTE** - ela só aparece uma vez!
4. Salve em lugar seguro (ex: gerenciador de senhas)

### Passo 4: Copiar Integration Key

1. Role até o topo da página
2. Copie o **Integration Key** (UUID longo)

## 🔐 Como Adicionar Secrets no Replit

1. Abra o painel de Secrets no Replit (ícone de cadeado)
2. Adicione cada secret:
   - **Key:** `DOCUSIGN_INTEGRATION_KEY`
   - **Value:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   
3. Repita para `DOCUSIGN_SECRET_KEY` e `DOCUSIGN_REDIRECT_URI`

## 🚀 Fluxo de Autenticação

```
┌─────────┐                 ┌─────────────┐                 ┌─────────┐
│ BrokerChain  │                 │   DocuSign  │                 │  Database │
│ Frontend │                 │   OAuth     │                 │         │
└────┬────┘                 └──────┬──────┘                 └────┬────┘
     │                              │                              │
     │ 1. Clicar "Connect DocuSign" │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │ 2. Redirecionar para login   │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
     │ 3. Usuário faz login         │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │ 4. DocuSign retorna com code │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
     │ 5. Trocar code por token     │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │ 6. Retornar access_token +   │                              │
     │    refresh_token             │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
     │ 7. Salvar tokens             │                              │
     ├──────────────────────────────────────────────────────────>│
     │                              │                              │
     │ 8. Confirmar sucesso         │                              │
     │<──────────────────────────────────────────────────────────┤
```

## 📝 Notas Importantes

### ✅ Vantagens do OAuth vs JWT:
- ✓ Sem bugs do SDK (RS256 algorithm error resolvido)
- ✓ Sem necessidade de private key em arquivo
- ✓ Tokens com refresh automático
- ✓ Mais seguro (secret key + authorization flow)
- ✓ Padrão da indústria para produção

### ⚠️ Limitações:
- Requer interação do usuário (1 vez apenas)
- Precisa configurar Redirect URI no DocuSign
- Tokens expiram (mas renovam automaticamente)

### 🔄 Renovação Automática:
- Access token expira em **1 hora**
- Sistema renova automaticamente usando refresh_token
- Refresh acontece **5 minutos antes** da expiração
- Tokens salvos no banco de dados PostgreSQL

## 🧪 Como Testar

1. Configure os secrets no Replit
2. Acesse: `https://sua-repl.repl.co/api/docusign/oauth/connect`
3. Você verá um JSON com `authorizationUrl`
4. Copie e cole esta URL no navegador
5. Faça login no DocuSign
6. Autorize a aplicação
7. Você será redirecionado para página de sucesso!

## 🆘 Troubleshooting

### Erro: "redirect_uri_mismatch"
- ✓ Verifique se `DOCUSIGN_REDIRECT_URI` está exatamente igual no DocuSign Admin
- ✓ Inclua protocolo (`https://`)
- ✓ Sem barra final (`/`)

### Erro: "invalid_client"
- ✓ Verifique `DOCUSIGN_INTEGRATION_KEY` e `DOCUSIGN_SECRET_KEY`
- ✓ Confirme que está usando o ambiente correto (sandbox vs production)

### Erro: "Token expired"
- ✓ Sistema renova automaticamente - aguarde 1 minuto
- ✓ Se persistir, reconecte usando `/api/docusign/oauth/connect`

## 📚 Referências

- [DocuSign OAuth 2.0 Docs](https://developers.docusign.com/platform/auth/authcode/)
- [Integration Key Setup](https://developers.docusign.com/platform/auth/consent/)
- [Token Refresh](https://developers.docusign.com/platform/auth/reference/obtain-access-token/)
