import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../../shared/components/Input";
import { registerUser } from "../api/auth";
import { registerSchema, type RegisterValues } from "../schema";
import { useAuthStore } from "../store";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    // Errors are shown as a toast by the global handler in main.tsx
    onSuccess: (data) => {
      // Register also logs the user in: no need to call login after it
      useAuthStore.getState().setAuth(data);
      toast.success(`Account created. Welcome, ${data.user.name}!`);
      navigate("/app", { replace: true });
    },
  });

  function onSubmit(values: RegisterValues) {
    registerMutation.mutate(values);
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Create an account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Start your 14-day free trial.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <Input
          label="Full name"
          id="name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register("name")}
        />
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
        <Input
          label="Confirm password"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {registerMutation.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}

export default Register;
