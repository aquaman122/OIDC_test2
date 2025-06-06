import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VERIFIER_KEY = 'pkce-code-verifier';
const REDIRECT_URI = 'https://oidc-test2.vercel.app/auth/callback';
const TOKEN_ENDPOINT = 'http://localhost:8080/realms/supabase/protocol/openid-connect/token';
const CLIENT_ID = 'supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const codeVerifier = localStorage.getItem(VERIFIER_KEY);

      if (!code) {
        return;
      }
      if (!codeVerifier) {
        return;
      }

      try {
        const response = await fetch(TOKEN_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('id_token', data.id_token);

        navigate('/');
      } catch (error) {
        console.error('로그인 처리 중 오류 발생', error);
      }
    };

    handleCallback();
  }, [location.search]);

  return <div>로그인 중</div>;
};

export default AuthCallback;