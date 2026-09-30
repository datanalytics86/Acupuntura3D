import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8.5" cy="8.5" r="4.5" />
      <path d="M12 12.5 16 16.5" />
    </Icon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 4.5v11M4.5 10h11" />
    </Icon>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 10h11" />
    </Icon>
  );
}

export function IconReset(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 7.5H3.5V5" />
      <path d="M4 7.2A6 6 0 1 1 3.8 12" />
    </Icon>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 5.5v9l7-4.5-7-4.5Z" />
    </Icon>
  );
}

export function IconPause(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 5.5v9M13 5.5v9" />
    </Icon>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 4 16 7 10 10 4 7 10 4Z" />
      <path d="M4 10.5 10 13.5 16 10.5" />
      <path d="M4 13.5 10 16.5 16 13.5" />
    </Icon>
  );
}

export function IconIndex(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 5.5h12M4 10h12M4 14.5h8" />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" />
    </Icon>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12.5 4.5 7 10l5.5 5.5" />
    </Icon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.5 4.5 13 10l-5.5 5.5" />
    </Icon>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10" cy="10" r="6.25" />
      <path d="M8.2 8.1a1.8 1.8 0 1 1 2.5 1.7c-.6.3-.7.6-.7 1.2" />
      <path d="M10 14.2h.01" />
    </Icon>
  );
}
