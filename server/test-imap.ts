import Imap from 'imap';
import { simpleParser } from 'mailparser';

async function testIMAPConnection() {
  console.log('\n📬 TESTANDO CONEXÃO IMAP HOSTINGER...\n');
  
  const imapHost = process.env.SMTP_HOST?.replace('smtp', 'imap') || 'imap.hostinger.com';
  const imapUser = process.env.SMTP_USER;
  const imapPassword = process.env.SMTP_PASSWORD;

  console.log('📧 Configurações IMAP:');
  console.log(`   Host: ${imapHost}`);
  console.log(`   User: ${imapUser}`);
  console.log(`   Password: ${imapPassword ? '***' + imapPassword.slice(-4) : 'NÃO CONFIGURADO'}`);
  console.log('');

  if (!imapHost || !imapUser || !imapPassword) {
    console.error('❌ ERRO: Variáveis de ambiente IMAP não configuradas!');
    process.exit(1);
  }

  const imap = new Imap({
    user: imapUser,
    password: imapPassword,
    host: imapHost,
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  return new Promise((resolve, reject) => {
    imap.once('ready', () => {
      console.log('✅ CONEXÃO IMAP ESTABELECIDA!\n');
      
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          console.error('❌ Erro ao abrir INBOX:', err);
          reject(err);
          return;
        }

        console.log('📬 INBOX aberto com sucesso!');
        console.log(`   Total de mensagens: ${box.messages.total}`);
        console.log(`   Mensagens não lidas: ${box.messages.unseen}`);
        console.log('');

        if (box.messages.total === 0) {
          console.log('📭 Caixa de entrada vazia.');
          console.log('✅ Conexão IMAP funcionando! Sistema pronto para receber emails de suppliers.\n');
          imap.end();
          resolve(true);
          return;
        }

        // Buscar últimas 3 mensagens para testar
        console.log('📧 Buscando últimas 3 mensagens...\n');
        const fetchRange = box.messages.total > 3 ? `${box.messages.total - 2}:*` : '1:*';
        
        const fetch = imap.seq.fetch(fetchRange, {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
          struct: true,
        });

        let messageCount = 0;

        fetch.on('message', (msg, seqno) => {
          messageCount++;
          console.log(`\n--- Mensagem #${seqno} ---`);

          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', () => {
              const parsed = Imap.parseHeader(buffer);
              console.log(`   De: ${parsed.from?.[0] || 'N/A'}`);
              console.log(`   Para: ${parsed.to?.[0] || 'N/A'}`);
              console.log(`   Assunto: ${parsed.subject?.[0] || 'N/A'}`);
              console.log(`   Data: ${parsed.date?.[0] || 'N/A'}`);
            });
          });
        });

        fetch.once('error', (err) => {
          console.error('❌ Erro ao buscar mensagens:', err);
          reject(err);
        });

        fetch.once('end', () => {
          console.log(`\n✅ ${messageCount} mensagem(ns) lida(s) com sucesso!`);
          console.log('\n🎉 IMAP FUNCIONANDO PERFEITAMENTE!');
          console.log('✅ Sistema pode receber cotações de suppliers via email 24/7!\n');
          imap.end();
          resolve(true);
        });
      });
    });

    imap.once('error', (err: Error) => {
      console.error('\n❌ ERRO NA CONEXÃO IMAP:\n');
      
      if (err.message.includes('auth')) {
        console.error('🔐 ERRO DE AUTENTICAÇÃO:');
        console.error('   Credenciais IMAP incorretas ou expiradas');
      } else if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
        console.error('🌐 ERRO DE CONEXÃO:');
        console.error('   Servidor IMAP não encontrado ou recusou conexão');
        console.error(`   Verifique se o host está correto: ${imapHost}`);
      } else {
        console.error('Detalhes:', err.message);
      }
      
      console.error('');
      reject(err);
    });

    imap.once('end', () => {
      console.log('Conexão IMAP encerrada.');
    });

    console.log('🔄 Conectando ao servidor IMAP...\n');
    imap.connect();
  });
}

testIMAPConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
