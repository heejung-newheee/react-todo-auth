import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "w-auto font-medium flex items-center justify-center gap-2 whitespace-nowrap rounded-sm transition-[color,box-shadow,filter] disabled:pointer-events-none disabled:bg-disabled [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 hover:relative hover:before:absolute hover:before:inset-0 hover:before:bg-anc-cool-neutral-10 hover:before:opacity-[0.04] hover:before:pointer-events-none hover:before:rounded-sm",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border border-[#9CA3AC] disabled:bg-disabled disabled:border-disabled disabled:text-disabled-foreground/32",
        outline:
          "bg-background text-foreground border border-[#9CA3AC] disabled:bg-disabled disabled:border-disabled disabled:text-disabled-foreground/32",
        primary: "bg-primary text-primary-foreground disabled:bg-primary/32",
        secondary:
          "bg-secondary text-secondary-foreground border-[#9CA3AC] disabled:bg-secondary/32 disabled:border-disabled disabled:text-neutral-400",
        destructive:
          "bg-destructive text-destructive-foreground disabled:bg-destructive/32 disabled:text-destructive-foreground/32",
        ghost:
          "disabled:bg-white disabled:text-neutral-400 hover:before:bg-white",
        link: "text-primary underline-offset-4",
        cancel: "width-auto bg-transparent justify-end text-foreground",
      },
      size: {
        default:
          "h-8 px-3 min-w-[64px] [&_svg:not([class*='size-'])]:size-4 has-[>svg]:p-2.5 has-[>svg]:min-w-[auto]",
        lg: "min-w-[96px] h-12 px-4 text-[15px] leading-4 rounded-md has-[>svg]:px-4",
        md: "min-w-[72px] h-10 px-4 text-[15px] leading-4 rounded-md has-[>svg]:min-w-[inherit] has-[>svg]:p-2.5",
        sm: "min-w-[60px] h-8 px-3 text-[14px] leading-4 [&_svg:not([class*='size-'])]:size-4 has-[>svg]:p-2.5 has-[>svg]:min-w-[auto] placeholder:text-[#6a737c] data-[placeholder]:text-[#6a737c]",
        xs: "min-w-[48px] h-7 px-2 text-3 leading-4 border-[#9CA3AC]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  }
);
