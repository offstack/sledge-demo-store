import {useState} from 'react';
import type {LayoutQuery} from 'storefrontapi.generated';
import {type EnhancedMenu} from '~/lib/utils';

import TopBar from './TopBar';
import Footer from './Footer';
import {Header} from './Header';
import {CartDrawer} from '..';

export interface ILayoutProps {
  children: React.ReactNode;
  layout: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
}

export function Layout({children, layout}: ILayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header isOpen={isOpen} setCartDrawerState={setIsOpen} />
      <main role="main" id="mainContent" className="flex-grow">
        <CartDrawer isOpen={isOpen} setCartDrawerState={setIsOpen} />
        {children}
      </main>
      <Footer />
    </div>
  );
}
