// Tipos para usuário
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  acceptedPrivacyTerms: string | null;
}

// Tipo para informações de autenticação
export interface AuthInfo {
  token: string;
  user: User;
  privacyNotification: {
    required: boolean;
    message?: string;
  };
}

// Tipo para contexto de autenticação
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  privacyNotification: {
    required: boolean;
    message: string;
  };
  showPrivacyModal: boolean;
  privacyRejected: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { name: string, email: string, password: string }) => Promise<boolean>;
  acceptPrivacyTerms: () => Promise<void>;
  rejectPrivacyTerms: () => void;
  closePrivacyModal: () => void;
  reopenPrivacyModal: () => void;
}

// Tipo para configuração de notificação de privacidade
export interface PrivacyNotificationConfig {
  id: number;
  active: boolean;
  message: string;
  lastUpdated: string;
} 