
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PasswordContextType {
    password: string;
    setPassword: (password: string) => void;
}

export const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export const PasswordProvider = ({ children }: { children: ReactNode }) => {
    const [password, setPassword] = useState('');
    return (
        <PasswordContext.Provider value={{ password, setPassword }}>
            {children}
        </PasswordContext.Provider>
    );
};

export const usePassword = () => {
    const context = useContext(PasswordContext);
    if (!context) {
        throw new Error('usePassword must be used within a PasswordProvider');
    }
    return context;
};
