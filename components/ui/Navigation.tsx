'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { cn } from '@/utils';
import { APP_NAME, URLS } from '@/constants';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: URLS.PRICING },
    { name: 'About', href: '#about' },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: URLS.HOME });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href={URLS.HOME} className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-primary">{APP_NAME}</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {session ? (
            <>
              <Link href={URLS.DASHBOARD}>
                <Button variant="ghost" size="md">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="md" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href={URLS.SIGNIN}>
                <Button variant="ghost" size="md">
                  Sign in
                </Button>
              </Link>
              <Link href={URLS.SIGNUP}>
                <Button variant="primary" size="md">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <Link href={URLS.HOME} className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-primary">{APP_NAME}</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-4">
                {session ? (
                  <>
                    <Link href={URLS.DASHBOARD} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="md" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="primary" 
                      size="md" 
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={URLS.SIGNIN} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="md" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link href={URLS.SIGNUP} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="md" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </header>
  );
}