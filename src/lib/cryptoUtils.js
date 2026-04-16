



export async function hashSenha(senha) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100_000;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(senha),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, hash: 'SHA-512', iterations },
    key,
    512
  );

  const hashHex = Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${saltHex}:${iterations}:${hashHex}`;
}


export async function verificarSenha(senha, senhaHash) {
  const [saltHex, iterStr, storedHash] = senhaHash.split(':');
  const iterations = Number(iterStr);

  const salt = new Uint8Array(
    saltHex.match(/.{2}/g).map((b) => parseInt(b, 16))
  );

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(senha),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, hash: 'SHA-512', iterations },
    key,
    512
  );

  const candidateHash = Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return timingSafeEqual(candidateHash, storedHash);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}


export function gerarSenhaAleatoria(length = 10) {
  const charset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((v) => charset[v % charset.length])
    .join('');
}


const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não definido no .env.local');
  return new TextEncoder().encode(secret);
};

const b64url = (data) =>
  btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

const strToB64url = (str) => b64url(new TextEncoder().encode(str));


export async function signToken(payload, expiresIn = '7d') {
  const secret = getJwtSecret();

  const expSeconds = parseExpiry(expiresIn);
  const now = Math.floor(Date.now() / 1000);

  const fullPayload = { ...payload, iat: now, exp: now + expSeconds };

  const header = strToB64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = strToB64url(JSON.stringify(fullPayload));
  const message = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const signature = b64url(sig);

  return `${message}.${signature}`;
}


export async function verifyToken(token) {
  try {
    const secret = getJwtSecret();
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const message = `${header}.${body}`;

    const key = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = Uint8Array.from(
      atob(signature.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(message)
    );

    if (!valid) return null;

    const payload = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/')));

    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expirado
    }

    return payload;
  } catch {
    return null;
  }
}

function parseExpiry(expiry) {
  if (typeof expiry === 'number') return expiry;
  const units = { s: 1, m: 60, h: 3600, d: 86400 };
  const match = String(expiry).match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 86400; // default: 7 dias
  return Number(match[1]) * units[match[2]];
}
