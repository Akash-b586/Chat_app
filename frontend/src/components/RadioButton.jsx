import React from "react";

const RadioButton = React.forwardRef(
  ({ name, options, defaultChecked }, ref) => {
    return (
      <div className="flex items-center justify-center gap-8">
        {options.map(({ value, label, styleClass }) => (
          <label key={value} className="label cursor-pointer">
            <span className="label-text">{label}</span>
            <input
              type="radio"
              className={`radio ${styleClass || "radio-primary"} mx-5`}
              name={name}
              value={value}
              ref={ref}
              defaultChecked={defaultChecked === value}
              aria-label={value}
            />
          </label>
        ))}
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";

export { RadioButton };
