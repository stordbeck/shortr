import React from "react";

export type Ref = HTMLInputElement;

const Input = React.forwardRef<Ref, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={[
        "rounded-lg shadow-md px-4 py-3 placeholder-gray-400 focus:ring-blue-500 focus:ring-2 border-0 outline-none text-gray-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {props.children}
    </input>
  )
);

export default Input;