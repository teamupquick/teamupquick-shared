import LogoSVG from "@shared-assets/svg/logo.svg?react";

type Props = {
  onClick?: VoidFunction;
  styles?: React.CSSProperties;
};

export default function Logo({ onClick, styles }: Props) {
  return <LogoSVG onClick={onClick} style={styles} />;
}
