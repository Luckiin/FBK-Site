/**
 * cpfService.js
 *
 * ─── POR QUE NÃO HÁ AUTO-PREENCHIMENTO REAL GRATUITO ─────────────────────────
 * Dados pessoais vinculados a CPF (nome, sexo, data de nascimento) são protegidos
 * pela LGPD (Lei nº 13.709/2018). A Receita Federal não disponibiliza API pública
 * com esses dados. Qualquer serviço que afirme oferecer isso gratuitamente está
 * realizando scraping ilegal ou usando dados vazados.
 *
 * O que este serviço faz de forma legítima e gratuita:
 *   ✅ Valida os dígitos verificadores do CPF (algoritmo oficial da Receita Federal)
 *   ✅ Retorna null para dados pessoais — o usuário preenche manualmente
 *
 * Para produção com auto-preenchimento real, utilize serviços autorizados:
 *   • Serpro DataValid  → https://servicos.serpro.gov.br/datavalid
 *   • Serasa Experian   → https://www.serasa.com.br/
 *   • Neoway            → https://www.neoway.com.br/
 * ──────────────────────────────────────────────────────────────────────────────
 */

/**
 * Valida o CPF usando o algoritmo oficial dos dígitos verificadores.
 * Funciona 100% offline, sem custo, sem dependências.
 *
 * @param {string} cpf — aceita "000.000.000-00" ou "00000000000"
 * @returns {boolean}
 */
export function validarCPF(cpf) {
  const n = cpf.replace(/\D/g, '');

  if (n.length !== 11) return false;

  // Rejeita sequências repetidas (ex: 000.000.000-00, 111.111.111-11)
  if (/^(\d)\1{10}$/.test(n)) return false;

  const calcDigito = (base, pesoInicial) =>
    base.split('').reduce((soma, d, i) => soma + Number(d) * (pesoInicial - i), 0);

  const resto1 = (calcDigito(n.slice(0, 9), 10) * 10) % 11;
  const d1 = resto1 >= 10 ? 0 : resto1;
  if (d1 !== Number(n[9])) return false;

  const resto2 = (calcDigito(n.slice(0, 10), 11) * 10) % 11;
  const d2 = resto2 >= 10 ? 0 : resto2;
  return d2 === Number(n[10]);
}

/**
 * Formata um CPF numérico para o padrão com pontuação.
 * @param {string} cpf
 * @returns {string} "000.000.000-00"
 */
export function formatarCPF(cpf) {
  return cpf
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * "Consulta" de dados por CPF.
 *
 * Por restrições da LGPD, não existe API gratuita e legítima que retorne
 * dados pessoais a partir do CPF. Esta função retorna null intencionalmente,
 * fazendo com que o formulário exiba os campos para preenchimento manual.
 *
 * Para integrar com Serpro DataValid (ou similar), substitua o corpo desta
 * função pela chamada HTTP ao serviço contratado:
 *
 *   const res = await fetch(`https://gateway.apiserpro.serpro.gov.br/datavalid/v2/validate`, {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${process.env.SERPRO_TOKEN}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({ key: { cpf: cpfSomenteNumeros } }),
 *   });
 *   const data = await res.json();
 *   return { nome: data.nome, sexo: data.sexo, data_nascimento: data.data_nascimento };
 *
 * @param {string} _cpf
 * @returns {Promise<null>}
 */
export async function getDadosPorCPF(_cpf) {
  // Retorna null: dados pessoais serão preenchidos manualmente pelo operador.
  return null;
}
