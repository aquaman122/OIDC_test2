import { useEffect, useState } from 'react';
import { decodeJWT } from './utils/jwt';
import { generateCodeVerifier, redirectToLoginWithPKCE } from './utils/pkce';
import styled from 'styled-components';

interface UserInfo {
  name?: string;
  email?: string;
  preferred_username?: string;
  [key: string]: any;
}

function App() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const idToken = localStorage.getItem('id_token');
    if (idToken) {
      const decoded = decodeJWT(idToken);
      setUser(decoded);
    } else {
      setUser(null);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('pkce-code-verifier', generateCodeVerifier());
    redirectToLoginWithPKCE();
  };


  const handleLogout = () => {
    
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);

    const KEYCLOAK_LOGOUT_URL = 'http://localhost:8080/realms/supabase/protocol/openid-connect/logout';
    const redirectUri = encodeURIComponent('http://localhost:3000');
    window.location.href = `${KEYCLOAK_LOGOUT_URL}?redirect_uri=${redirectUri}`;
  };
  console.log(user);


  return (
    <Container>
      <h1>1번 SSO 프로젝트</h1>
      {!user && <LoginButton onClick={handleLogin}>로그인</LoginButton>}
      {user && <LoginButton onClick={handleLogout}>로그아웃</LoginButton>}
      <h1>👋 Welcome</h1>
      {user ? (
        <div>
          <p>이름 {user.name}</p>
          <p>이메일 {user.email}</p>
          <p>사용자명 {user.preferred_username}</p>
        </div>
      ) : (
        <p>로그인되지 않았습니다.</p>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoginButton = styled.button`
  font-size: 19.2px;
  padding: 12.8px 24px;
  margin-bottom: 24px;
  cursor: pointer;
`;


export default App;