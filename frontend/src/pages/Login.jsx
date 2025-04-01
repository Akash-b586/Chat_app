import { AuthForm } from "../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "../components/TextInput";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { loginUserSchema } from "../../../shared/userValidation";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const defaultFormData = {
  email: "",
  password: "",
};

const Login = () => {
  const {
    register,
    handleSubmit: onSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: joiResolver(loginUserSchema),
    defaultValues: defaultFormData,
  });

  const loading = useAuthStore((state) => state.loading.login);
  const error = useAuthStore((state) => state.error.login);
  const userLogin = useAuthStore((state) => state.userLogin);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      useAuthStore.setState((state) => ({ ...state.error, login: false }));
    };
  }, [navigate]);

  // Show error toast if there are errors in the form
  useEffect(() => {
    if (isSubmitted && Object.keys(errors).length > 0) {
      toast.error("Whoops! There was an error with your submission");
    }
  }, [isSubmitted, errors]);

  return (
    <AuthForm>
      <form
        onSubmit={onSubmit((data) => {
          userLogin(data);
        })}
        className="space-y-6"
      >
        <TextInput
          name="email"
          {...register("email")}
          type="email"
          error={!!errors.email || error}
        />
        {errors.email && <ErrorMessage message={errors.email.message} />}

        <TextInput
          name="password"
          type="password"
          {...register("password")}
          error={!!errors.password || error}
        />
        {errors.password && <ErrorMessage message={errors.password.message} />}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
      <div className="text-center">
        <p className="text-base-content/60">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="link link-primary">
            Create account
          </Link>
        </p>
      </div>
    </AuthForm>
  );
};

export default Login;
