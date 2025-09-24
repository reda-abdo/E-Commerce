
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmailContextType {
    email: string;
    setEmail: (email: string) => void;
}

export const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState('');
    return (
        <EmailContext.Provider value={{ email, setEmail }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmail = () => {
    const context = useContext(EmailContext);
    if (!context) {
        throw new Error('useEmail must be used within an EmailProvider');
    }
    return context;
};
