import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

import {
  loginSchema,
  type LoginFormData,
  type AuthResponse,
} from "@/types/types";
import { useLoginMutation } from "@/App/apis/authApi";
import { useAppDispatch } from "@/App/hooks/hooks";
import { setcredentials } from "@/App/slices/authslice";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg("");
    try {
      const response: AuthResponse = await login(data).unwrap();
      const { accessToken, user } = response.data;

      dispatch(setcredentials({ accesstoken: accessToken, user }));
      toast.success("Login successful");

      if (user.role === "ADMIN" || "OWNER")
        navigate("/dashboard", { replace: true });
      else if (user.role === "USER") navigate("/menu", { replace: true });
    } catch (err: any) {
      const message = err?.data?.error || err?.message || "Login failed";
      setErrorMsg(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-150 flex items-center justify-center">
      <div className="w-full max-w-md border rounded-3xl p-8 shadow-sm bg-white transition-all duration-300">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Login to continue ordering your favorite food
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="w-full mt-2 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className="w-full mt-2 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition pr-10"
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
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* API ERROR */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 disabled:opacity-50 transition font-medium"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* NAV */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="ml-2 text-red-500 font-medium cursor-pointer hover:text-red-600"
          >
            Sign up
          </button>
        </div>

        {/* NAV */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Explore without account ?
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="ml-2 text-red-500 font-medium cursor-pointer hover:text-red-600"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
