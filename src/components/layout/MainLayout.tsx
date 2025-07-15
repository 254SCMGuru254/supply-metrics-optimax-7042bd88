
import React from 'react';
import { ProfessionalFooter } from './ProfessionalFooter';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <ProfessionalFooter />
    </div>
  );
};
