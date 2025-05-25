import { useState, useEffect } from 'react';

export const useUserEmail = (): string | null => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const parsed = JSON.parse(userSession);
        setEmail(parsed.client.email_address || null);
      } else {
        setEmail(null);
      }
    } catch (error) {
      console.error('Failed to parse userSession from localStorage:', error);
      setEmail(null);
    }
  }, []);

  return email;
};

export const useUserEthWallet = (): string | null => {
  const [ethWallet, setEthWallet] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const parsed = JSON.parse(userSession);
        setEthWallet(parsed.client.eth_wallet_address || null);
      } else {
        setEthWallet(null);
      }
    } catch (error) {
      console.error('Failed to parse userSession from localStorage:', error);
      setEthWallet(null);
    }
  }, []);

  return ethWallet;
};
