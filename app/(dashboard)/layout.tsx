import { AuthenticatedNav } from '../../components/ui/authNavbar';

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