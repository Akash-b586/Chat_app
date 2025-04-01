import React, { useState } from "react";
import classNames from "classnames";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const types = {
  email: Mail,
  password: Lock,
  text: User,
};

const autoComplete = {
  email: "email",
  password: "current-password",
  text: "name",
};

const TextInput = React.forwardRef(
  ({ name, error, type = "text", ...rest }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const inputClass = classNames("input input-bordered w-full pl-10", {
      "input-error": error,
    });

    const InputIcon = types[type];

    return (
      <div className="form-control">
        <label className="label" htmlFor={name}>
          <span className="label-text font-medium">{formattedName}</span>
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <InputIcon className="h-5 w-5 text-base-content/40" />
          </div>
          <input
            id={name}
            ref={ref}
            className={inputClass}
            name={name}
            type={type === "password" && isPasswordVisible ? "text" : type}
            autoComplete={autoComplete[type]}
            placeholder={
              type === "password"
                ? "••••••••"
                : type === "email"
                ? "name@example.com"
                : "john.doe"
            }
            {...rest}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {isPasswordVisible ? (
                <EyeOff className="h-5 w-5 text-base-content/40" />
              ) : (
                <Eye className="h-5 w-5 text-base-content/40" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export { TextInput };
