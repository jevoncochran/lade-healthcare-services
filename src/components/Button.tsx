import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { IconComponent } from "./Icons";

// One component for every button and button-style link on the site.
// Styles come from the .btn classes in src/app/globals.css.
//
//   <Button href="/book-a-ride">Book a Ride</Button>              → Next.js <Link>
//   <Button href={site.phoneHref} icon={PhoneIcon}>Call</Button>  → <a> (tel:, mailto:, external)
//   <Button onClick={submit}>Submit</Button>                     → <button>

export type ButtonVariant =
  "primary" | "outline" | "light" | "outline-light" | "link";
export type ButtonSize = "md" | "lg";

type BaseProps = {
  /** primary = green CTA · outline = navy outline · light / outline-light = for dark backgrounds · link = text link */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconComponent;
  iconPosition?: "left" | "right";
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href"> & {
    href: string;
  };

type NativeButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: never };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  outline: "btn btn-outline",
  light: "btn btn-light",
  "outline-light": "btn btn-outline-light",
  link: "link-arrow",
};

const Button = (props: ButtonProps) => {
  const {
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    className = "",
    children,
    ...rest
  } = props;

  const classes = [
    variantClasses[variant],
    size === "lg" && variant !== "link" && "btn-lg",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="h-5 w-5 shrink-0" />}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className="h-5 w-5 shrink-0" />
      )}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as Omit<
      LinkButtonProps,
      keyof BaseProps
    >;
    // Internal pages use Next.js client-side navigation; tel:, mailto: and external URLs use <a>.
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<
    NativeButtonProps,
    keyof BaseProps
  >;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
};

export default Button;
