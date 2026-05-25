import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { updateProfileSchema } from "@/types/types";
import type { z } from "zod";

import { useUpdateProfileMutation } from "@/App/apis/profileApi";
import { useAppDispatch, useAppSelector } from "@/App/hooks/hooks";
import { setcredentials } from "@/App/slices/authslice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      imageUrl: user?.imageUrl ?? "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    // strip empty strings so optional fields aren't sent as ""
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "" && v !== undefined),
    );

    try {
      const response = await updateProfile(payload).unwrap();

      // keep redux in sync with updated user
      dispatch(
        setcredentials({
          accesstoken: accessToken!,
          user: response.data,
        }),
      );

      toast.success("Profile updated successfully");
      navigate("/profile", { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-4">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </button>

        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-6 space-y-6">
            {/* HEADER */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Edit Profile
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Update your name, phone number, or profile image.
              </p>
            </div>

            {/* AVATAR PREVIEW */}
            <div className="flex justify-center">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Current avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-red-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center text-red-500 text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  {...register("name")}
                  placeholder="Your full name"
                  className="w-full mt-2 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  {...register("phoneNumber")}
                  placeholder="+1234567890"
                  className="w-full mt-2 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* IMAGE URL */}
              <div>
                <label className="text-sm font-medium">Profile Image URL</label>
                <input
                  {...register("imageUrl")}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full mt-2 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
