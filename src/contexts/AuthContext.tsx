import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  purchasedCourses: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  purchaseCourse: (courseId: string) => void;
  hasPurchased: (courseId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Aluno Demo',
    email: 'aluno@healthmed.com',
    password: '123456',
    role: 'student',
    purchasedCourses: ['c1', 'c4'],
  },
  {
    id: '2',
    name: 'Professor Admin',
    email: 'admin@healthmed.com',
    password: 'admin123',
    role: 'admin',
    purchasedCourses: [],
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('healthmed-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('healthmed-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('healthmed-user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'student',
      purchasedCourses: [],
    };
    
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const purchaseCourse = (courseId: string) => {
    if (user && !user.purchasedCourses.includes(courseId)) {
      setUser({
        ...user,
        purchasedCourses: [...user.purchasedCourses, courseId],
      });
    }
  };

  const hasPurchased = (courseId: string) => {
    return user?.purchasedCourses.includes(courseId) ?? false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      purchaseCourse,
      hasPurchased,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
