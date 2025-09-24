"use client"
import CreateContextProvider from '@/contexts/cartContext'
import { store } from '@/redux/store'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { EmailProvider } from '@/contexts/emailContext'
import { PasswordProvider } from '@/contexts/passwordContext'
import { WishHeartProvider } from '@/contexts/whishHartContext'


export default function ProvidersComponent({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <Provider store={store}>
                <CreateContextProvider>
                    <PasswordProvider>
                        <EmailProvider>
                            <WishHeartProvider>
                                {children}
                            </WishHeartProvider>
                        </EmailProvider>
                    </PasswordProvider>
                </CreateContextProvider>
            </Provider>
        </SessionProvider>
    )
}
