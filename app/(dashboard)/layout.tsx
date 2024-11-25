import { AuthenticatedNav } from './home/_components/authNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AuthenticatedNav isScrolled={false} showSearchInNav={false} />
      <div>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
} 