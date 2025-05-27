export interface User {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    userRole: string;
    role: {
      role: string;
      isAdmin: boolean;
    };
    preferences: {
      emailNoti: boolean;
      timeZone: string;
    };
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    passwordHash: string; // This will be the plain password from the form
    firstName: string;
    lastName: string;
    userRole: string;
    role: {
      role: string;
      isAdmin: boolean;
    };
    preferences: {
      emailNoti: boolean;
      timeZone: string;
    };
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (credentials: LoginRequest) => Promise<boolean>;
    register: (userData: RegisterRequest) => Promise<boolean>;
    logout: () => void;
    isAdmin: boolean;
    loading: boolean;
  }