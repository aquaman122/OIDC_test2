export function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('JWT 디코딩 실패:', e);
    return null;
  }
}