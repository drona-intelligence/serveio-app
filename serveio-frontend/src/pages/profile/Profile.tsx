import { useNavigate, Link } from "react-router-dom";
import { Pencil, LogOut, Mail, Phone, ShieldCheck, User } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/App/hooks/hooks";
import { clearCredentials } from "@/App/slices/authslice";
import { useLogoutMutation } from "@/App/apis/authApi";
import { useGetProfileQuery } from "@/App/apis/profileApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // fetch fresh profile data (includes latest imageUrl)
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(
    undefined,
    {
      skip: !isAuthenticated, // don't fetch if not logged in
    },
  );

  const profile = profileData?.data ?? user; // prefer fresh data, fall back to redux

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch {
      // even if server call fails, clear local state
    } finally {
      dispatch(clearCredentials());
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-2xl shadow-sm border">
          <CardContent className="py-10 flex flex-col items-center text-center space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">Not Logged In</h1>
              <p className="text-muted-foreground mt-2">
                You need to login to access your profile.
              </p>
            </div>
            <Link to="/login">
              <Button className="rounded-xl px-6 bg-red-500 hover:bg-red-600">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isProfileLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  const avatarFallback = profile?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-4">
        {/* PROFILE CARD */}
        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-6">
            {/* TOP ROW — avatar + edit + logout */}
            <div className="flex items-start justify-between mb-6">
              {/* AVATAR */}
              <div className="flex items-center gap-4">
                {profile?.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name ?? "Profile"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-red-100"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* fallback initial */}
                <div
                  style={profile?.imageUrl ? { display: "none" } : {}}
                  className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-3xl font-bold border-2 border-red-200"
                >
                  {avatarFallback}
                </div>

                <div>
                  <h1 className="text-xl font-bold">{profile?.name}</h1>
                  <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-500 border border-red-200 rounded-full px-2 py-0.5 mt-1">
                    <ShieldCheck size={12} />
                    {profile?.role}
                  </span>
                </div>
              </div>

              {/* ICON ACTIONS */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-gray-200 hover:border-red-300 hover:text-red-500"
                  onClick={() => navigate("/profile/edit")}
                  title="Edit profile"
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-gray-200 hover:border-red-300 hover:text-red-500"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Logout"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground border rounded-xl px-4 py-3">
                <Mail size={16} className="text-red-400 shrink-0" />
                <span>{profile?.email}</span>
              </div>

              {profile?.phoneNumber && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground border rounded-xl px-4 py-3">
                  <Phone size={16} className="text-red-400 shrink-0" />
                  <span>{profile.phoneNumber}</span>
                </div>
              )}

              {profile?.name && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground border rounded-xl px-4 py-3">
                  <User size={16} className="text-red-400 shrink-0" />
                  <span>{profile.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FULL WIDTH LOGOUT */}
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3"
        >
          <LogOut size={16} className="mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
