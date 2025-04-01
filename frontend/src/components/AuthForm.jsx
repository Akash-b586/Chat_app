import { MessageSquare } from "lucide-react";
import { AuthImage } from "../components/AuthImage";
import classNames from "classnames";

export const AuthForm = ({ children, mode = "login" }) => {
  const isLogin = mode === "login";
  return (
    <div
      className={classNames("grid lg:grid-cols-2 align-center justify-center", {
        "h-screen": isLogin,
        "min-h-screen": !isLogin,
      })}
    >
      {/* Left Side - Form */}
      <div
        className={classNames(
          "flex flex-col justify-center items-center p-6 sm:p-12 md:w-[800px] lg:w-full",
          {
            "mt-0": isLogin,
            "mt-16": !isLogin,
          }
        )}
      >
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-1 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="text-base-content/60">
                {isLogin ? "Sign in to your account" : "Sign up to get started"}
              </p>
            </div>
          </div>

          {children}
        </div>
      </div>
      <AuthImage
        title={isLogin ? "Welcome" : "Join Us"}
        subtitle={
          isLogin
            ? "Connect and stay in touch with your loved ones."
            : "Start your journey with us and stay connected."
        }
      />
    </div>
  );
};
