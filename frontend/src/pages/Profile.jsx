import { useAuthStore } from '@/store/authStore';
import { User, Mail, Shield, MapPin, Camera, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Profile() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-destructive font-bold">Please login to view your profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card rounded-3xl border shadow-sm p-8 text-center space-y-4">
            <div className="relative inline-block group">
              <img 
                src={user?.ProfileImageUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} 
                alt={user?.FullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-xl"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.FullName}</h2>
              <p className="text-sm text-muted-foreground">{user?.Email}</p>
            </div>
            <div className="pt-4 flex justify-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Pro Member</span>
            </div>
          </div>

          <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Account Security
            </h3>
            <Button variant="outline" className="w-full justify-start font-normal">Change Password</Button>
            <Button variant="outline" className="w-full justify-start font-normal">Two-Factor Auth</Button>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <h3 className="font-bold">Personal Information</h3>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <div className="flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{user?.FullName}</p>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{user?.Email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</label>
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">San Francisco, CA</p>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Joined</label>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">May 2024</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-muted/10 border-t flex justify-end">
              <Button>Edit Profile</Button>
            </div>
          </div>

          <div className="bg-card rounded-3xl border shadow-sm p-8">
            <h3 className="font-bold mb-4">Travel Preferences</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Beach', 'Mountains', 'City', 'Culture'].map(tag => (
                <div key={tag} className="border rounded-2xl p-4 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                  <span className="text-sm font-medium">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
