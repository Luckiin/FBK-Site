
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fbk-site.vercel.app';

// ─── Template base ────────────────────────────────────────────────────────────
function baseTemplate({ titulo, corTitulo = '#dc2626', conteudo, rodape = '' }) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#0a0a0f 100%);padding:28px 36px;text-align:center;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <div style="display:inline-block;border:2px solid #d4a017;border-radius:50%;padding:2px;">
                    <div style="background:#1a1a2e;border-radius:50%;width:52px;height:52px;line-height:52px;text-align:center;font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-1px;">FBK</div>
                  </div>
                  <div style="margin-top:10px;font-size:10px;font-weight:700;color:#d4a017;letter-spacing:3px;text-transform:uppercase;">Kickboxing</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 36px 24px;">
            <h2 style="margin:0 0 20px;font-size:22px;font-weight:900;color:${corTitulo};">${titulo}</h2>
            ${conteudo}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px 28px;border-top:1px solid #f0f0f0;">
            ${rodape}
            <p style="margin:12px 0 0;font-size:12px;color:#aaa;">
              Este é um email automático da <strong>Federação Baiana de Kickboxing</strong>.<br/>
              Por favor, não responda a este email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Envio base ───────────────────────────────────────────────────────────────
export async function sendEmail(to, subject, body, html) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) {
    console.error('[EMAIL SERVICE] RESEND_API_KEY não configurada');
    throw new Error('RESEND_API_KEY não configurada');
  }

  if (!from) {
    console.error('[EMAIL SERVICE] EMAIL_FROM não configurado');
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

    console.error('[EMAIL SERVICE] Erro no Resend:', detalhe, '| para:', to, '| data:', JSON.stringify(data));
    throw new Error(detalhe);
  }

  console.log('[EMAIL SERVICE] Email enviado com sucesso:', { to, subject, id: data.id });
  return { sucesso: true, emailId: data.id };
}

// ─── Recuperação de senha ─────────────────────────────────────────────────────
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

  const html = baseTemplate({
    titulo: 'Redefinição de Senha',
    corTitulo: '#dc2626',
    conteudo: `
      <p style="margin:0 0 12px;color:#333;">Olá, <strong>${nome}</strong>!</p>
      <p style="margin:0 0 20px;color:#555;line-height:1.6;">
        Recebemos uma solicitação para redefinir a senha da sua conta FBK.
      </p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${resetUrl}"
           style="display:inline-block;padding:14px 32px;background:#dc2626;color:#fff;
                  text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
          Redefinir minha senha
        </a>
      </p>
      <p style="margin:0;padding:12px 16px;background:#fff8f8;border-left:3px solid #dc2626;border-radius:4px;font-size:13px;color:#666;">
        ⚠️ Este link expira em <strong>15 minutos</strong>.<br/>
        Se você não solicitou a redefinição, ignore este email com segurança.
      </p>
    `,
  });

  return sendEmail(to, subject, body, html);
}

// ─── Cadastro recebido (para o usuário) ───────────────────────────────────────
export async function sendFilialCadastroRecebido({ to, nome }) {
  const subject = 'Cadastro Recebido — FBK';

  const body =
    `Olá, ${nome}!\n\n` +
    `Recebemos o cadastro da sua filial com sucesso.\n\n` +
    `Nossa equipe irá analisar as informações enviadas e retornará por email em breve.\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  const html = baseTemplate({
    titulo: 'Cadastro Recebido com Sucesso!',
    corTitulo: '#1d4ed8',
    conteudo: `
      <p style="margin:0 0 12px;color:#333;">Olá, <strong>${nome}</strong>!</p>
      <p style="margin:0 0 20px;color:#555;line-height:1.6;">
        Recebemos o cadastro da sua filial e ele já está em análise pela nossa equipe.
      </p>
      <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 8px;font-weight:700;color:#1d4ed8;">O que acontece agora?</p>
        <ul style="margin:0;padding-left:20px;color:#555;line-height:1.8;font-size:14px;">
          <li>Nossa equipe avaliará as informações enviadas</li>
          <li>Você receberá um email com o resultado da análise</li>
          <li>Se aprovado, terá acesso imediato ao portal</li>
        </ul>
      </div>
      <p style="margin:0;color:#777;font-size:14px;line-height:1.6;">
        Caso tenha dúvidas, entre em contato com a federação.
      </p>
    `,
  });

  return sendEmail(to, subject, body, html);
}

// ─── Filial aprovada ──────────────────────────────────────────────────────────
export async function sendFilialAprovada({ to, nome }) {
  const subject = 'Cadastro Aprovado — FBK ✅';
  const loginUrl = `${APP_URL}/auth/entrar`;

  const body =
    `Olá, ${nome}!\n\n` +
    `Ótima notícia! Seu cadastro de filial foi aprovado.\n\n` +
    `Você já pode acessar o portal em:\n${loginUrl}\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  const html = baseTemplate({
    titulo: 'Cadastro Aprovado! 🎉',
    corTitulo: '#16a34a',
    conteudo: `
      <p style="margin:0 0 12px;color:#333;">Olá, <strong>${nome}</strong>!</p>
      <p style="margin:0 0 20px;color:#555;line-height:1.6;">
        Ótima notícia! O cadastro da sua filial foi <strong style="color:#16a34a;">aprovado</strong> pela Federação Baiana de Kickboxing.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
        <p style="margin:0;color:#166534;font-size:14px;line-height:1.6;">
          ✅ Sua conta está ativa e você já pode acessar o portal de gerenciamento.
        </p>
      </div>
      <p style="text-align:center;margin:0 0 16px;">
        <a href="${loginUrl}"
           style="display:inline-block;padding:14px 32px;background:#16a34a;color:#fff;
                  text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
          Acessar o portal
        </a>
      </p>
    `,
  });

  return sendEmail(to, subject, body, html);
}

// ─── Filial reprovada ─────────────────────────────────────────────────────────
export async function sendFilialReprovada({ to, nome, motivo }) {
  const subject = 'Cadastro Não Aprovado — FBK';

  const body =
    `Olá, ${nome}!\n\n` +
    `Infelizmente, seu cadastro de filial não foi aprovado neste momento.\n\n` +
    `Motivo informado:\n${motivo}\n\n` +
    `Se necessário, ajuste as informações e entre em contato com a federação.\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  const html = baseTemplate({
    titulo: 'Cadastro Não Aprovado',
    corTitulo: '#dc2626',
    conteudo: `
      <p style="margin:0 0 12px;color:#333;">Olá, <strong>${nome}</strong>!</p>
      <p style="margin:0 0 20px;color:#555;line-height:1.6;">
        Após análise, o cadastro da sua filial <strong>não foi aprovado</strong> neste momento.
      </p>
      <div style="background:#fff8f8;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 6px;font-weight:700;color:#dc2626;font-size:14px;">Motivo informado:</p>
        <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">${motivo}</p>
      </div>
      <p style="margin:0;color:#777;font-size:14px;line-height:1.6;">
        Se quiser, corrija as informações e entre em contato com a federação para uma nova avaliação.
      </p>
    `,
    rodape: `
      <p style="margin:0 0 8px;font-size:13px;color:#555;">
        Precisa de ajuda? Entre em contato com a federação.
      </p>
    `,
  });

  return sendEmail(to, subject, body, html);
}

// ─── Notificação para o admin ─────────────────────────────────────────────────
export async function sendNovaFilialAdmin({ nomeFilial, emailFilial }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fbk.com.br';
  const subject = 'Nova Filial Aguardando Aprovação — FBK';
  const painelUrl = `${APP_URL}/filiais`;

  const body =
    `Uma nova filial foi cadastrada e aguarda aprovação:\n\n` +
    `Nome: ${nomeFilial}\n` +
    `Email: ${emailFilial}\n\n` +
    `Acesse o painel administrativo para aprovar ou reprovar:\n${painelUrl}`;

  const html = baseTemplate({
    titulo: 'Nova Filial Aguardando Aprovação',
    corTitulo: '#d97706',
    conteudo: `
      <p style="margin:0 0 20px;color:#555;line-height:1.6;">
        Uma nova filial foi cadastrada e está aguardando sua análise.
      </p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="font-size:13px;color:#92400e;font-weight:700;padding-bottom:4px;">Nome da Filial</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#333;padding-bottom:12px;">${nomeFilial}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#92400e;font-weight:700;padding-bottom:4px;">Email</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#333;">${emailFilial}</td>
          </tr>
        </table>
      </div>
      <p style="text-align:center;margin:0;">
        <a href="${painelUrl}"
           style="display:inline-block;padding:14px 32px;background:#d97706;color:#fff;
                  text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
          Ver no painel
        </a>
      </p>
    `,
  });

  return sendEmail(adminEmail, subject, body, html);
}
// ─── Boas-vindas para o filiado ─────────────────────────────────────────────
export async function sendBoasVindasFiliado({ to, nome, telefone, senhaTemporaria }) {
  const subject = 'Bem-vindo(a) à FBK — Seus dados de acesso 🥋';
  const loginUrl = `${APP_URL}/auth/entrar`;

  const body =
    `Olá, ${nome}!\n\n` +
    `Seu cadastro na Federação Baiana de Kickboxing foi realizado com sucesso.\n\n` +
    `Estes são seus dados para o primeiro acesso:\n` +
    `📲 Login: ${telefone}\n` +
    `🔑 Senha: ${senhaTemporaria}\n\n` +
    `Acesse o portal e altere sua senha no primeiro acesso:\n${loginUrl}\n\n` +
    `Atenciosamente,\nEquipe FBK`;

  const html = baseTemplate({
    titulo: 'Bem-vindo(a) à FBK! 🥋',
    corTitulo: '#1a1a2e',
    conteudo: `
      <p style="margin:0 0 12px;color:#333;">Olá, <strong>${nome}</strong>!</p>
      <p style="margin:0 0 20px;color:#555;line-height:1.6;">
        Seu cadastro como filiado na <strong>Federação Baiana de Kickboxing</strong> foi realizado com sucesso.
        Agora você tem acesso ao nosso portal exclusivo.
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:0 0 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:12px;">
              <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Login (Telefone)</span><br/>
              <strong style="font-size:18px;color:#1e293b;">${telefone}</strong>
            </td>
          </tr>
          <tr>
            <td>
              <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Senha Temporária</span><br/>
              <strong style="font-size:18px;color:#dc2626;font-family:monospace;">${senhaTemporaria}</strong>
            </td>
          </tr>
        </table>
      </div>
      <p style="text-align:center;margin:0 0 24px;">
        <a href="${loginUrl}"
           style="display:inline-block;padding:14px 32px;background:#1a1a2e;color:#fff;
                  text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
          Acessar meu portal
        </a>
      </p>
      <p style="margin:0;padding:12px 16px;background:#fffbeb;border-left:3px solid #d97706;border-radius:4px;font-size:13px;color:#92400e;">
        👉 <strong>Dica:</strong> Por segurança, altere sua senha no primeiro acesso.
      </p>
    `,
  });

  return sendEmail(to, subject, body, html);
}
