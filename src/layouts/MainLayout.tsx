import Header from '../components/Header';
import '../index.css';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

interface MainLayoutProps {
  user: { username: string; role: string } | null;
}

export default function MainLayout({ user }: MainLayoutProps) {
  return (
    <>
      <Header user={user} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
