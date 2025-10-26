# BrokerChain - Guia de Deploy para brokerchain.business (Hostinger)

## ✅ Pré-requisitos Concluídos

- ✅ SAM.gov API Key configurada e funcionando
- ✅ SAM.gov scraper capturando RFQs automaticamente a cada 6 horas
- ✅ Páginas PFAS, Buy America e EUDR exibindo RFQs capturadas
- ✅ Email automation (SMTP/IMAP Hostinger) configurado
- ✅ PostgreSQL database (Neon) funcionando
- ✅ OpenAI API Key configurada

## 🚀 Deploy via Replit Publishing

### Passo 1: Publicar na Replit

1. Clique no botão **"Publish"** no topo do editor Replit
2. A Replit irá:
   - Construir a aplicação automaticamente
   - Configurar domínio `.replit.app` temporário
   - Gerenciar TLS/HTTPS automaticamente
   - Fazer health checks

### Passo 2: Configurar Domínio Personalizado (brokerchain.business)

#### No Hostinger:

1. Acesse o painel de controle da Hostinger
2. Vá para **DNS/Name Servers**
3. Adicione um registro **CNAME**:
   - **Nome**: `@` (ou deixe vazio para root domain)
   - **Tipo**: CNAME
   - **Valor**: `<seu-app>.replit.app` (você receberá isso após publicar)
   - **TTL**: 3600

4. Se precisar de `www.brokerchain.business`:
   - **Nome**: `www`
   - **Tipo**: CNAME
   - **Valor**: `<seu-app>.replit.app`
   - **TTL**: 3600

#### No Replit (após publishing):

1. Vá para **Deployments** → **Custom Domain**
2. Insira: `brokerchain.business`
3. Siga as instruções para validação DNS
4. A Replit configurará TLS/HTTPS automaticamente

### Passo 3: Variáveis de Ambiente (Secrets)

As seguintes secrets já estão configuradas no Replit:

✅ **DATABASE_URL** - Neon PostgreSQL
✅ **SAM_GOV_API_KEY** - SAM.gov API access
✅ **OPENAI_API_KEY** - OpenAI GPT-4o-mini
✅ **SMTP_HOST** - smtp.hostinger.com
✅ **SMTP_USER** - contact@brokerchain.business
✅ **SMTP_PASSWORD** - (configurado)
✅ **SESSION_SECRET** - (gerado)

**Nota:** Essas secrets são automaticamente transferidas para o ambiente de produção quando você publica.

## 📊 Funcionalidades Ativas no Deploy

### Step Zero - SAM.gov Scraping Automático
- ✅ Executa a cada 6 horas automaticamente
- ✅ Busca oportunidades do dia atual apenas
- ✅ Filtra por PFAS, Buy America e EUDR
- ✅ Cria buyers e RFQs automaticamente
- ✅ Sistema anti-duplicação funcionando

### Email Automation (Hostinger)
- ✅ SMTP configurado para envio automático de RFQs
- ✅ IMAP monitorando inbox 24/7 para quotes de suppliers
- ✅ Email parsing com OpenAI para extrair cotações

### Páginas Públicas
- ✅ `/` - Homepage
- ✅ `/pfas` - PFAS/EPR Compliance
- ✅ `/buyamerica` - Buy America Act
- ✅ `/eudr` - EU Deforestation Regulation
- ✅ `/suppliers` - Supplier directory
- ✅ `/dashboard` - Admin dashboard

### API Endpoints
- ✅ `GET /api/rfqs?framework={pfas|buyamerica|eudr}` - RFQs por framework
- ✅ `GET /api/suppliers?framework={framework}` - Suppliers filtrados
- ✅ `POST /api/admin/scrape-sam-gov` - Trigger manual SAM.gov scraping

## 🔧 Configurações Importantes

### Performance
- Frontend: Vite build otimizado
- Backend: Express.js com compression
- Database: Neon serverless PostgreSQL (auto-scaling)
- Cache: TanStack Query com cache automático

### Security
- ✅ HTTPS automático via Replit
- ✅ Secrets gerenciadas pela Replit
- ✅ CORS configurado corretamente
- ✅ Rate limiting no SAM.gov scraper (500ms entre requests)

### Monitoring
- Logs disponíveis via Replit Dashboard
- SAM.gov scraping stats nos logs
- Email delivery tracking
- Database queries via Neon console

## 📝 Pós-Deploy Checklist

- [ ] Verificar domínio brokerchain.business acessível
- [ ] Testar `/buyamerica` exibe RFQs do SAM.gov
- [ ] Confirmar SAM.gov scraping rodando (verificar logs)
- [ ] Testar envio de email via formulário RFQ
- [ ] Verificar IMAP monitorando inbox
- [ ] Confirmar OpenAI API funcionando para AI features

## 🆘 Troubleshooting

### SAM.gov API 429 (Too Many Requests)
- **Causa**: Rate limiting do SAM.gov
- **Solução**: O scraper já tem delay de 500ms entre requests. Se persistir, aguarde 1 hora e tente novamente.

### Email não enviando
- **Verificar**: Secrets SMTP_HOST, SMTP_USER, SMTP_PASSWORD
- **Testar**: Use `telnet smtp.hostinger.com 465` para verificar conectividade

### Domínio não resolvendo
- **Aguarde**: Propagação DNS pode levar até 24 horas
- **Verificar**: `dig brokerchain.business` deve mostrar CNAME para replit.app

## 📞 Suporte

- **Replit Support**: https://replit.com/support
- **SAM.gov API**: https://open.gsa.gov/api/opportunities-api/
- **Hostinger DNS**: Painel de controle Hostinger

---

**Desenvolvido com ❤️ para BrokerChain - Automated B2B Compliance Broker**
