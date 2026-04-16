


export function validarCPF(cpf) {
  const n = cpf.replace(/\D/g, '');

  if (n.length !== 11) return false;

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


export function formatarCPF(cpf) {
  return cpf
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}


export async function getDadosPorCPF(_cpf) {
  return null;
}
