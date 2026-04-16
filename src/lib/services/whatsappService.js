


export async function sendWhatsApp(telefone, mensagem) {
  const telefoneFormatado = telefone.replace(/\D/g, '');
  const messageId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('[WHATSAPP SERVICE - MOCK] Mensagem simulada');
  console.log(`📱 Para: +55 ${telefoneFormatado}`);
  console.log(`💬 Mensagem:\n${mensagem}`);
  console.log(`🔑 MessageID: ${messageId}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await new Promise((resolve) => setTimeout(resolve, 200));

  return { sucesso: true, messageId };
}


export async function sendBoasVindas({ telefone, nome, senhaTemporaria }) {
  const mensagem =
    `Olá, ${nome}! Bem-vindo(a) à FBK 🥋\n\n` +
    `Seu acesso foi criado com sucesso.\n\n` +
    `📲 *Login:* ${telefone}\n` +
    `🔑 *Senha:* ${senhaTemporaria}\n\n` +
    `Acesse o portal e altere sua senha no primeiro acesso.\n` +
    `Dúvidas? Fale com sua filial.`;

  return sendWhatsApp(telefone, mensagem);
}


export async function sendNovoFiliado({ telefoneFilial, nomeFiliado }) {
  const mensagem =
    `🔔 *Novo filiado cadastrado!*\n\n` +
    `Nome: ${nomeFiliado}\n` +
    `Cadastrado em: ${new Date().toLocaleDateString('pt-BR')}`;

  return sendWhatsApp(telefoneFilial, mensagem);
}
