import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../../shared/components/Input";
import { loginUser } from "../api/auth";
import { loginSchema, type LoginValues } from "../schema";
import { useAuthStore } from "../store";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    // Errors are shown as a toast by the global handler in main.tsx
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/app", { replace: true });
    },
  });

  function onSubmit(values: LoginValues) {
    loginMutation.mutate(values);
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Log in to your account to continue.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}

export default Login;
