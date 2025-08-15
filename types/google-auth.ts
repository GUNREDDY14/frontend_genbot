// Google Authentication Types
export interface GoogleSignInConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_prompt: boolean;
}

export interface GoogleButtonOptions {
  type: 'standard';
  size: 'large';
  theme: 'outline';
  text: 'signin_with' | 'signup_with';
  shape: 'rectangular';
  logo_alignment: 'left';
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

// Global Google types declaration
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleSignInConfig) => void;
          renderButton: (element: HTMLElement, options: GoogleButtonOptions) => void;
          prompt: () => void;
        };
      };
    };
  }
}
