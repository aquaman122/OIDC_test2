// src/utils/pkce.ts

export function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

export async function redirectToLoginWithPKCE() {
  const codeVerifier = generateCodeVerifier();
  const verifierKey = 'pkce-code-verifier';
  localStorage.setItem(verifierKey, codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const redirectUri = encodeURIComponent('https://oidc-test2.vercel.app/auth/callback');
  const clientId = 'supabase';
  const scope = 'openid email profile';
  const state = crypto.randomUUID();

  const authUrl = `http://localhost:8080/realms/supabase/protocol/openid-connect/auth` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${redirectUri}` +
    `&state=${state}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  window.location.href = authUrl;
}