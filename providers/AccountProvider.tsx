import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import WebAPIClient from "@services/WebAPIClient";

export type IAccount = {
  id?: string;
  email?: string;
  emailVerified?: string;
  accessToken?: string;
  createdAt?: string;
  loading: boolean;
};

export interface AccountContextProps {
  account?: IAccount;
  authenticatedApi?: WebAPIClient;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success?: boolean; error?: string }>;
  logout: () => Promise<boolean>;
  authenticate: (accessToken: string) => Promise<boolean>;
}

const AccountContext = createContext<AccountContextProps>({
  loading: true,
  login: async (email: string, password: string) => {
    return {};
  },
  logout: async () => false,
  authenticate: async (accessToken: string) => false,
});

export default function AccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = useProvideAccount();
  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
}

function useProvideAccount(): AccountContextProps {
  const [account, setAccount] = useState<IAccount | undefined>();
  const [loading, setLoading] = useState(true);
  const authenticatedApi = new WebAPIClient(account?.accessToken);

  useEffect(() => {
    if (account) {
      setLoading(false);
    }
  }, [account]);
  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then((token) => {
      if (token) {
        authenticate(token);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const authenticate = async (accessToken: string) => {
    const api = new WebAPIClient(accessToken);

    const response = await api.me();
    if (response && response.id) {
      setAccount({ ...response, accessToken });
      return true;
    }

    setLoading(false);

    return false;
  };

  const login = async (email: string, password: string) => {
    const response = await authenticatedApi
      .login(email, password)
      .catch((e) => e);

    if (response.success && response.account && response.token) {
      await SecureStore.setItemAsync("accessToken", response.token);
      setAccount({ ...response.account, accessToken: response.token });
      return { success: true };
    }

    if (!response) {
      return { error: "Please try again soon." };
    }

    return { error: response.error };
  };

  const logout = async () => {
    setAccount(undefined);
    await SecureStore.deleteItemAsync("accessToken");
    return true;
  };

  return {
    account,
    authenticatedApi,
    authenticate,
    login,
    logout,
    loading,
  };
}

export function useAccount() {
  return useContext(AccountContext);
}
