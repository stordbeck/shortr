import React from "react";

export type Ref = HTMLButtonElement;

const Button = React.forwardRef<Ref, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={[
        "rounded-lg shadow-md p-3 placeholder-gray-400 focus:ring-green-500 focus:ring-2 text-gray-100 bg-green-600 hover:bg-green-700 outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {props.children}
    </button>
  )
);

export default Button;
