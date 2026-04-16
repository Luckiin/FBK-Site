/**
 * emailService.js
 * Envio real de emails via API HTTP do Resend.
 *
 * Variaveis esperadas:
 * - RESEND_API_KEY
 * - EMAIL_FROM
 * - NEXT_PUBLIC_APP_URL
 * - ADMIN_EMAIL
 */

/**
 * Envia um email pelo Resend.
 * @param {string} to - Email do destinatário
 * @param {string} subject - Assunto
 * @param {string} body - Corpo em texto plano
 * @param {string} [html] - Corpo em HTML (opcional)
 * @returns {Promise<{ sucesso: boolean, emailId: string }>}
 */
export async function sendEmail(to, subject, body, html) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY não configurada');
  }

  if (!from) {
    throw new Error('EMAIL_FROM não configurado');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text: body,
      ...(html ? { html } : {}),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const detalhe =
      data?.error?.message ||
      data?.message ||
      'Falha ao enviar email pelo Resend';

    console.error('[EMAIL SERVICE] Erro no Resend:', detalhe, data);
    throw new Error(detalhe);
  }

  return { sucesso: true, emailId: data.id };
}

/**
 * Email de recuperação de senha.
 * @param {{ to: string, nome: string, resetUrl: string }} params
 */
export async function sendRecuperacaoSenha({ to, nome, resetUrl }) {
  const subject = 'Redefinição de Senha — FBK';
  const body =
    `Olá, ${nome}!\n\n` +
    `Recebemos uma solicitação para redefinir a senha da sua conta.\n\n` +
    `Clique no link abaixo para criar uma nova senha:\n` +
    `${resetUrl}\n\n` +
    `⚠️ Este link expira em 15 minutos.\n\n` +
    `Se você não solicitou a redefinição, ignore este email.\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #c0392b;">Redefinição de Senha</h2>
      <p>Olá, <strong>${nome}</strong>!</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
      <p>
        <a href="${resetUrl}"
           style="display:inline-block; padding:12px 24px; background:#c0392b; color:#fff;
                  text-decoration:none; border-radius:6px; font-weight:bold;">
          Redefinir minha senha
        </a>
      </p>
      <p style="color:#666; font-size:13px;">
        ⚠️ Este link expira em <strong>15 minutos</strong>.<br/>
        Se você não solicitou a redefinição, ignore este email.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="color:#999; font-size:12px;">Equipe FBK</p>
    </div>
  `;

  return sendEmail(to, subject, body, html);
}

/**
 * Email de boas-vindas para filial aprovada.
 * @param {{ to: string, nome: string }} params
 */
export async function sendFilialAprovada({ to, nome }) {
  const subject = 'Cadastro Aprovado — FBK';
  const body =
    `Olá, ${nome}!\n\n` +
    `Seu cadastro de filial foi aprovado! Você já pode acessar o portal.\n\n` +
    `Acesse: ${process.env.NEXT_PUBLIC_APP_URL}/auth/entrar\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  return sendEmail(to, subject, body);
}

/**
 * Email de confirmação de recebimento do cadastro da filial.
 * @param {{ to: string, nome: string }} params
 */
export async function sendFilialCadastroRecebido({ to, nome }) {
  const subject = 'Cadastro Recebido — FBK';
  const body =
    `Olá, ${nome}!\n\n` +
    `Recebemos o cadastro da sua filial com sucesso.\n\n` +
    `Nossa equipe irá analisar as informações enviadas e retornará por email após a conclusão.\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  return sendEmail(to, subject, body);
}

/**
 * Email de reprovação de cadastro da filial.
 * @param {{ to: string, nome: string, motivo: string }} params
 */
export async function sendFilialReprovada({ to, nome, motivo }) {
  const subject = 'Cadastro Não Aprovado — FBK';
  const body =
    `Olá, ${nome}!\n\n` +
    `Seu cadastro de filial não foi aprovado neste momento.\n\n` +
    `Motivo informado:\n${motivo}\n\n` +
    `Se necessário, ajuste as informações e entre em contato com a federação.\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  return sendEmail(to, subject, body);
}

/**
 * Email de notificação para admin sobre nova filial pendente.
 * @param {{ nomeFilial: string, emailFilial: string }} params
 */
export async function sendNovaFilialAdmin({ nomeFilial, emailFilial }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fbk.com.br';
  const subject = 'Nova Filial Aguardando Aprovação — FBK';
  const body =
    `Uma nova filial foi cadastrada e aguarda aprovação:\n\n` +
    `Nome: ${nomeFilial}\n` +
    `Email: ${emailFilial}\n\n` +
    `Acesse o painel administrativo para aprovar ou reprovar.`;

  return sendEmail(adminEmail, subject, body);
}
