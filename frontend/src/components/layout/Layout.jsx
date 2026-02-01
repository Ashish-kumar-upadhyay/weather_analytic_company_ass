import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => (
  <div className="min-h-screen">
    <Header />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layout;
