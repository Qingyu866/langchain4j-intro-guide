import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-area">
        <main className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
