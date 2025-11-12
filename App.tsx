import React, { useState, useCallback, useMemo, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { User, Role } from './types';
import { ROLES, MOCK_USERS } from './services/mockApi';
import AuthPage from './components/Auth';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  signup: (name: string, email: string, role: Role) => Promise<User | null>;
  updateAuthUser: (updatedUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, pass: string): Promise<User | null> => {
    console.log(`Attempting login for ${email}`);
    // This is a mock login. In a real app, you would verify the password.
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      console.log('User found:', foundUser);
      setUser(foundUser);
      return foundUser;
    }
    console.log('User not found');
    return null;
  }, []);

  const signup = useCallback(async (name: string, email: string, role: Role): Promise<User | null> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatarUrl: `https://i.pravatar.cc/150?u=${email}`
    };
    MOCK_USERS.push(newUser);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateAuthUser = useCallback((updatedUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...updatedUserData };
    });
  }, []);

  const value = useMemo(() => ({ user, login, logout, signup, updateAuthUser }), [user, login, logout, signup, updateAuthUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/auth" />;
    }
    return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;