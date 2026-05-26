import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

import { registerSchema, type RegisterFormData } from "@/types/types";

import { useRegisterMutation } from "@/App/apis/authApi";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMsg("");

      await registerUser(data).unwrap();

      toast.success("Registered successfully Please log in");
      navigate("/login", { replace: true });
    } catch (err: any) {
      const message = err?.data?.error || err?.message || "Register failed";
      setErrorMsg(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="w-full max-w-md border rounded-3xl p-8 shadow-sm bg-white transition-all duration-300">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>

          <p className="text-sm text-muted-foreground mt-2">
            Sign up and start exploring delicious meals
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label>Name</label>
            <input
              {...register("name")}
              className="w-full mt-2 border p-3 rounded-xl"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full mt-2 border p-3 rounded-xl"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label>Phone</label>
            <input
              {...register("phoneNumber")}
              className="w-full mt-2 border p-3 rounded-xl"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full mt-2 border p-3 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* NAV */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="ml-2 text-red-500 font-medium cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
