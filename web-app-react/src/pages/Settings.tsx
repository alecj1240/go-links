import { NavBar } from '@/components/common/NavBar';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { DangerZone } from '@/components/settings/DangerZone';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';

export const Settings = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Settings</h1>
          <p className="text-xl text-gray-600">
            Manage your Go Links profile and account
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl">

          {/* Profile Section */}
          <ProfileSection />

          {/* Danger Zone */}
          <DangerZone />
        </div>
      </main>
    </div>
  );
};