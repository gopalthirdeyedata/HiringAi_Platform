import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

export default function ClerkAdminGuard({ children }) {
    return (
        <>
            <SignedIn>
                {children}
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn redirectUrl="/" />
            </SignedOut>
        </>
    );
}
