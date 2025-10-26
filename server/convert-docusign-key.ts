#!/usr/bin/env tsx
/**
 * 🔑 CONVERSOR DE CHAVE DOCUSIGN
 * 
 * Converte RSA PRIVATE KEY para PKCS#8 PRIVATE KEY
 * (formato aceito pelo DocuSign SDK)
 */

import { spawn } from 'child_process';
import fs from 'fs';

const RSA_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAprNb7guCSmrp39/v8t6F4cjiN9RhXjUhJwpXMPkpRgOZ8yn4
dbw2cTRs9+afDNJ+h+AAsRmIHhQTQPE1nAcrOnCWjeGgupreKrLi94DaDDRTymzs
kQylyzo0H7yvnmJdFynSXuhhj3gBmB6UWGt/M25YISpHC7qqdEzT0B2crBEFqRS4
ZK4mEKEnGdCnICV4Sx6u/ANCy8MnJd3YEWobnQK6JxZ9G6NskqFNVUrQUMclEPCO
uW/mz6dS8+gsxu4glSjS3BEdyEcR9TxVNl8Ubxo6nlCHEJofZ13zoL+XsbdAKyT2
uo+At6L2/RVn+uiAP7SeOgcUBxXxkcF6KVlHiQIDAQABAoIBAAOEZcRmQEO/MTuM
v0SNzt/Wa/V3GO3Sq6Yl+PR60VTdlxYzFL+xLqnhTApH9qOf3lUSFBmoev99d3GH
lVS7Lv2O6hJIyCofwd+/QfwsXw1iXkE3Xp9p16arzfU8dy0dkK7ALmTbvNE43DnA
LWuXKwokAh6DBJg6AkYtZ8uskEVuFr7Rjr4vGlQ/uETMRSFL2s4GpJjAoH4H8HBa
5G5y4Q/WRvXvagwaqb9nNT6dZIkCODwN3nkfQBYYPlcm9DRSl7yDZ0WyAvWUlh/x
PMoE2CN8HFxgMMviYx6D+F3tUnrj+wROGBOQQ8UT4sAKnlvpRSzFYB1hima3f5Dm
RDbMlf0CgYEA5ejK9H1OGVMW8N6TGLlpQtSyb+WQ1w3Z8tC2YKjjEZThcwuXblBz
nC8rwg3JMNyt8LgS8zr/mxoX1Z5WWwWGvRdz20+jhoFxIIFFaKcCeaNjb94pV38W
XTLk1tocJ7n7TOtoS4IWtb/3PU9epnq94A2JJG6HuL/3t61IvtxqhEUCgYEAuZ5C
WSxSTQLFxt4P+rHnd1j+2nAmvx4Og+8U5koPn32tJBOyh4v4KT4dn06b1qSakjU1
FIeboDUPSxapIIbkNQxIp4zuU3PojtCytDsBrC8iJ429WO7WMNfXUsNFW6fas0bv
1dHLuCioSSyarfaJ3Q1081ZGssEYtlMHut8uxHUCgYEAzOrxwnrRGndZkjT/7OCN
dni31k5KC7QX13m5pGvDf88wJudlAHkKomHU4bCB62A2VMDsewjR/D+EkO0A0T4a
uv1lUUspWGCVIUC3SbDZ3usHXRUpygfHOih7mRhsUehNmWCU5AA+F57TUj0lAsOR
61qFKwitRbkspPT5SsyQz/UCgYAh57GQ3lKuNHpx5/AdR8/S8hOjTOcW8+OM3+f+
ZLrT1D4DIAH1VnDe/7Sje9VlcK23VTa76EVaDzca7Sm5gko/El5XFJwX7E0ngSGT
YE/e5sEjXnWewAmp5FM1j+ukYVXGd4epk+fVXL/YlegvLKBkG2goZrMFRdZAv4vi
6498XQKBgQC6yJ5N1SKi9v0bVngF+QrGpOL5KMIuDXMSKrxD7pnr5MHeXDXHbZoF
BmYok1+tk2xcX2SCj3zqd3ZA/RlMp/hC1gXuPAKeDN5XlnoDWBFrGBHRC7bjB1Hi
wVHyXHeO0p2y1ONGtU7MGrd0qHqi4Cj42c1AugnC2pGMhg4kLOAVtQ==
-----END RSA PRIVATE KEY-----`;

console.log("\n╔══════════════════════════════════════════════════════════╗");
console.log("║     🔑 CONVERSOR DE CHAVE DOCUSIGN (RSA → PKCS#8)       ║");
console.log("╚══════════════════════════════════════════════════════════╝\n");

async function convertKey() {
  // Salvar chave temporária
  const tempRsaPath = '/tmp/docusign_rsa.key';
  const tempPkcs8Path = '/tmp/docusign_pkcs8.key';
  
  console.log("📝 Passo 1: Salvando chave RSA temporária...");
  fs.writeFileSync(tempRsaPath, RSA_KEY);
  console.log(`   ✅ Salva em: ${tempRsaPath}\n`);
  
  console.log("🔄 Passo 2: Convertendo RSA → PKCS#8 usando OpenSSL...");
  
  return new Promise<void>((resolve, reject) => {
    const openssl = spawn('openssl', [
      'pkcs8',
      '-topk8',
      '-inform', 'PEM',
      '-outform', 'PEM',
      '-in', tempRsaPath,
      '-out', tempPkcs8Path,
      '-nocrypt'
    ]);
    
    openssl.on('close', (code) => {
      if (code !== 0) {
        console.error(`   ❌ Erro: OpenSSL retornou código ${code}`);
        reject(new Error('Conversão falhou'));
        return;
      }
      
      console.log(`   ✅ Convertido com sucesso!\n`);
      
      console.log("📄 Passo 3: Lendo chave PKCS#8...");
      const pkcs8Key = fs.readFileSync(tempPkcs8Path, 'utf-8');
      
      console.log("\n╔══════════════════════════════════════════════════════════╗");
      console.log("║     ✅ CHAVE CONVERTIDA (PKCS#8 FORMAT)                  ║");
      console.log("╚══════════════════════════════════════════════════════════╝\n");
      
      console.log("📋 COPIE A CHAVE ABAIXO E SALVE COMO DOCUSIGN_PRIVATE_KEY:\n");
      console.log("─────────────────────────────────────────────────────────────");
      console.log(pkcs8Key);
      console.log("─────────────────────────────────────────────────────────────\n");
      
      console.log("🎯 PRÓXIMOS PASSOS:\n");
      console.log("   1. Copie a chave acima (começando com -----BEGIN PRIVATE KEY-----)");
      console.log("   2. Vá em Replit Secrets");
      console.log("   3. Edite DOCUSIGN_PRIVATE_KEY");
      console.log("   4. Cole a nova chave PKCS#8");
      console.log("   5. Salve e reinicie o workflow\n");
      
      // Limpar arquivos temporários
      fs.unlinkSync(tempRsaPath);
      fs.unlinkSync(tempPkcs8Path);
      
      resolve();
    });
    
    openssl.stderr.on('data', (data) => {
      console.error(`OpenSSL stderr: ${data}`);
    });
  });
}

convertKey().catch(console.error);
