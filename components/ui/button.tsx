import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl  font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-wide",
  {
    variants: {
      variant: {
        locked:
          "bg-blue-100 text-primary-foreground hover:bg-neutral-200/90 border-neutral-600 border-b-4 active:border-b-0",
        default:
          "bg-blue-100 text-black border-blue-300 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500",
        primary:
          "bg-sky-400 text-primary-foreground hover:bg-blue-400/90 border-blue-500 border-b-4 active:border-b-0",
        primaryOutline:
          "bg-white text-blue-400 hover:bg-blue-500/90 hover:text-white border-blue-500 border-2 ",
        secondary:
          "bg-blue-700 text-primary-foreground hover:bg-blue-600/90 border-blue-800 border-b-4 active:border-b-0",
        secondaryOutline:
          " text-blue-500 hover:bg-blue-200 border-transparent hover:border-transparent shadow-md hover:shadow-lg transition-shadow",

        danger:
          "bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
        dangerOutline: "bg-white text-rose-500 hover:bg-slate-100",
        super:
          "bg-indigo-500 text-primary-foreground hover:bg-indigo-500/90 border-indigo-600 border-b-4 active:border-b-0",
        superOutline: "bg-white text-indigo-500 hover:bg-slate-100",
        ghost:
          "bg-transparent text-blue-800 border-transparent border-0 hover:bg-slate-100",
        sidebar:
          "bg-transparent text-blue-800 border-2 border-transparent hover:bg-blue-100 transition-none",
        sidebarOutline:
          "bg-blue-300/15 text-blue-600 border-blue-300 border-2 hover:bg-blue-500/20 transition-none",
        // button for an animated ai companian(chatbot)
        chatbot:
          "bg-white text-blue-600 border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-blue-500",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
