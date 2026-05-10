import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { 
  User, Mail, Shield, MapPin, Camera, Calendar, 
  Languages, Trash2, Save, X, Heart, Globe, Settings as SettingsIcon,
  ChevronRight, Map, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { updateProfile, deleteAccount, getSavedDestinations, removeSavedDestination } from '@/api/user.api';
import { getTrips } from '@/api/trips.api';
import { uploadImage } from '@/api/upload.api';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  { label: 'Hindi', value: 'Hindi' },
];

export default function Profile() {
  const { user, setUser, logout, isLoading: isAuthLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      fullName: user?.FullName || '',
      email: user?.Email || '',
      bio: user?.Bio || '',
      location: user?.Location || '',
      language: user?.Language || 'English',
      profileImageUrl: user?.ProfileImageUrl || '',
    }
  });

  const profileImageUrl = watch('profileImageUrl');

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.FullName,
        email: user.Email,
        bio: user.Bio || '',
        location: user.Location || '',
        language: user.Language || 'English',
        profileImageUrl: user.ProfileImageUrl || '',
      });
      fetchSavedDestinations();
      fetchTripCount();
    }
  }, [user, reset]);

  const fetchTripCount = async () => {
    try {
      const trips = await getTrips();
      setTripCount(trips.length);
    } catch (error) {
      console.error('Failed to fetch trip count', error);
    }
  };

  const fetchSavedDestinations = async () => {
    setIsLoadingSaved(true);
    try {
      const data = await getSavedDestinations();
      setSavedDestinations(data);
    } catch (error) {
      console.error('Failed to fetch saved destinations', error);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Uploading image...');
    try {
      const data = await uploadImage(file);
      setValue('profileImageUrl', data.url);
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const onUpdateProfile = async (data) => {
    setIsUpdating(true);
    try {
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to delete account');
      setIsDeleting(false);
    }
  };

  const handleRemoveSaved = async (cityId) => {
    try {
      await removeSavedDestination(cityId);
      setSavedDestinations(prev => prev.filter(d => d.CityId !== cityId));
      toast.success('Removed from saved destinations');
    } catch (error) {
      toast.error('Failed to remove destination');
    }
  };

  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-destructive font-bold">Please login to view your profile</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-lg">Manage your identity, preferences and saved places.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <SettingsIcon className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSubmit(onUpdateProfile)} disabled={isUpdating} className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                {isUpdating ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Sidebar Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent -z-10"></div>
            
            <div className="relative inline-block mb-6">
              <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr from-primary via-primary/50 to-primary/10 shadow-2xl">
                <img 
                  src={profileImageUrl || user?.ProfileImageUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} 
                  alt={user?.FullName}
                  className="w-full h-full rounded-full object-cover border-4 border-background"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-1 right-1 p-3 bg-primary text-primary-foreground rounded-full shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all">
                  <Camera className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{user?.FullName}</h2>
              <p className="text-muted-foreground font-medium">{user?.Email}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/40 rounded-3xl border border-border/50">
                <p className="text-2xl font-bold text-primary">{tripCount}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trips</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-3xl border border-border/50">
                <p className="text-2xl font-bold text-primary">{savedDestinations.length}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Places</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
               <div className="flex items-center gap-3 text-muted-foreground px-4 py-2 hover:bg-muted/50 rounded-2xl transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">{user?.Language || 'English'}</span>
               </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-card rounded-[2.5rem] border border-border/50 shadow-xl p-8 space-y-4">
            <h3 className="text-lg font-bold px-2 flex items-center gap-2 mb-4 text-foreground">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Account Settings
            </h3>
            <Button variant="outline" className="w-full justify-between rounded-2xl h-14 group">
              <span className="flex items-center gap-3 font-semibold">
                <Shield className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                Privacy & Security
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full justify-between rounded-2xl h-14 border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40 group text-destructive"
            >
              <span className="flex items-center gap-3 font-semibold">
                <Trash2 className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Button>
          </div>
        </div>

        {/* Right Column: Detailed Forms & Saved Lists */}
        <div className="lg:col-span-8 space-y-10">
          {/* Detailed Info Card */}
          <div className="bg-card rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="px-10 py-8 border-b border-border/50 bg-muted/20 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                Personal Information
              </h3>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                  {isEditing ? (
                    <Input {...register('fullName')} className="rounded-2xl h-14 bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" placeholder="Enter your full name" />
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border border-transparent">
                      <User className="w-5 h-5 text-primary/60" />
                      <p className="font-semibold text-foreground text-lg">{user?.FullName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                  {isEditing ? (
                    <Input {...register('email')} className="rounded-2xl h-14 bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" placeholder="your@email.com" />
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border border-transparent">
                      <Mail className="w-5 h-5 text-primary/60" />
                      <p className="font-semibold text-foreground text-lg">{user?.Email}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Location</label>
                  {isEditing ? (
                    <Input {...register('location')} className="rounded-2xl h-14 bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" placeholder="e.g. London, UK" />
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border border-transparent">
                      <MapPin className="w-5 h-5 text-primary/60" />
                      <p className="font-semibold text-foreground text-lg">{user?.Location || 'Not specified'}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Language Preference</label>
                  {isEditing ? (
                    <select 
                      {...register('language')}
                      className="flex h-14 w-full rounded-2xl border-transparent bg-muted/30 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    >
                      {LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border border-transparent">
                      <Languages className="w-5 h-5 text-primary/60" />
                      <p className="font-semibold text-foreground text-lg">{user?.Language || 'English'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Bio / About Me</label>
                {isEditing ? (
                  <textarea 
                    {...register('bio')}
                    rows={4}
                    className="flex w-full rounded-2xl border-transparent bg-muted/30 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    placeholder="Tell us about your travel style..."
                  />
                ) : (
                  <div className="p-6 bg-muted/20 rounded-3xl border border-transparent italic text-muted-foreground leading-relaxed">
                    {user?.Bio || "You haven't added a bio yet. Tell the world about your adventures!"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Destinations List */}
          <div className="bg-card rounded-[2.5rem] border border-border/50 shadow-xl p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold flex items-center gap-3 text-foreground">
                <Heart className="w-7 h-7 text-destructive fill-destructive" />
                Saved Destinations
              </h3>
              <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-wider">
                {savedDestinations.length} Places
              </span>
            </div>

            {isLoadingSaved ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-[2rem]"></div>)}
              </div>
            ) : savedDestinations.length === 0 ? (
              <div className="text-center py-20 bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-border/50">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Map className="w-10 h-10 text-muted-foreground" />
                </div>
                <h4 className="text-xl font-bold text-foreground">No saved places yet</h4>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Explore destinations and click the heart icon to save them here for later.</p>
                <Button variant="outline" className="mt-8 rounded-full px-8" onClick={() => navigate('/dashboard')}>
                  Explore Now
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedDestinations.map((saved) => (
                  <div key={saved.SavedDestinationId} className="group bg-muted/30 rounded-[2rem] p-6 flex items-center gap-5 border border-transparent hover:border-primary/20 hover:bg-background hover:shadow-xl transition-all duration-300">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                      <img src={saved.City?.ImageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400"} alt={saved.City?.Name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-lg text-foreground">{saved.City?.Name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {saved.City?.Country}
                      </p>
                      <button 
                        onClick={() => handleRemoveSaved(saved.CityId)}
                        className="text-xs font-bold text-destructive hover:underline mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
