import nodemailer from 'nodemailer';

async function testSMTPConnection() {
  console.log('\n🔍 TESTANDO CONEXÃO SMTP HOSTINGER...\n');
  
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  console.log('📧 Configurações:');
  console.log(`   Host: ${smtpHost}`);
  console.log(`   User: ${smtpUser}`);
  console.log(`   Password: ${smtpPassword ? '***' + smtpPassword.slice(-4) : 'NÃO CONFIGURADO'}`);
  console.log('');

  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.error('❌ ERRO: Variáveis de ambiente SMTP não configuradas!');
    process.exit(1);
  }

  // Criar transportador SMTP
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465, // SSL
    secure: true, // true para porta 465
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    debug: true, // Modo debug para ver detalhes
    logger: true, // Logger ativo
  });

  try {
    console.log('🔄 Verificando conexão SMTP...\n');
    
    // Testar conexão
    await transporter.verify();
    
    console.log('✅ CONEXÃO SMTP BEM-SUCEDIDA!');
    console.log('✅ Credenciais estão CORRETAS!');
    console.log('✅ Servidor Hostinger respondendo normalmente.\n');
    
    // Testar envio de email de teste (opcional)
    console.log('📤 Enviando email de teste...\n');
    
    const info = await transporter.sendMail({
      from: `"BrokerChain Test" <${smtpUser}>`,
      to: smtpUser, // Envia para você mesmo
      subject: '✅ Teste SMTP - BrokerChain Automation',
      text: 'Se você recebeu este email, sua configuração SMTP está funcionando perfeitamente!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #10b981;">✅ Configuração SMTP Funcionando!</h2>
          <p>Parabéns! Seu sistema de automação de emails do BrokerChain está configurado corretamente.</p>
          <p><strong>Servidor:</strong> ${smtpHost}</p>
          <p><strong>Email:</strong> ${smtpUser}</p>
          <p>Agora o sistema pode enviar RFQs automaticamente para suppliers 24/7!</p>
        </div>
      `,
    });

    console.log('✅ EMAIL DE TESTE ENVIADO COM SUCESSO!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log(`\n🎉 TUDO FUNCIONANDO! Verifique sua caixa de entrada: ${smtpUser}\n`);
    
  } catch (error: any) {
    console.error('\n❌ ERRO NA CONEXÃO SMTP:\n');
    
    if (error.code === 'EAUTH') {
      console.error('🔐 ERRO DE AUTENTICAÇÃO:');
      console.error('   A senha (SMTP_PASSWORD) está INCORRETA!');
      console.error('');
      console.error('📋 SOLUÇÕES:');
      console.error('   1. Verifique se copiou a senha correta do Hostinger');
      console.error('   2. Se tem 2FA ativado, crie uma "App Password" no hPanel');
      console.error('   3. Tente fazer login no webmail (https://webmail.hostinger.com)');
      console.error('      com as mesmas credenciais para confirmar');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('🌐 ERRO DE CONEXÃO:');
      console.error('   Não foi possível conectar ao servidor SMTP');
      console.error('   Verifique se SMTP_HOST está correto: smtp.hostinger.com');
    } else {
      console.error('Detalhes do erro:', error.message);
      console.error('Código:', error.code);
    }
    
    console.error('');
    process.exit(1);
  }
}

testSMTPConnection();
