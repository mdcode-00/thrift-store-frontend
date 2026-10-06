import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { setCredentials } from '@/store/slices/authSlice';

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleSignInButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: buttonRef.current.offsetWidth,
    });

    async function handleCredentialResponse(response: { credential: string }) {
      try {
        const { data } = await axiosInstance.post('/auth/google', {
          idToken: response.credential,
        });
        dispatch(setCredentials({ user: data.user, token: data.accessToken }));
        navigate('/account');
      } catch (err) {
        console.error('Google sign-in failed', err);
      }
    }
  }, [dispatch, navigate]);

  return <div ref={buttonRef} className="w-full" />;
}