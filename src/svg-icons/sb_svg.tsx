import * as React from "react";

export interface SbIconProps {
  id?: string;
  fill?: string;
  className?: string;
  width?: string;
  height?: string;
  onClick?: () => void;
}

// AdHop logo, outline style: rounded-square ring with the jump arrow over a cut timeline.
export default function SbSvg({
  id = "",
  fill = "#ffc21a",
  className = "",
  onClick
}: SbIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      id={id}
      className={className}
      onClick={() => onClick?.() } >
      <path
        fillRule="evenodd"
        style={{ fill }}
        d="M126,16 H386 A110,110 0 0 1 496,126 V386 A110,110 0 0 1 386,496 H126 A110,110 0 0 1 16,386 V126 A110,110 0 0 1 126,16 Z M130,48 H382 A82,82 0 0 1 464,130 V382 A82,82 0 0 1 382,464 H130 A82,82 0 0 1 48,382 V130 A82,82 0 0 1 130,48 Z" />
      <g transform="translate(256 256) scale(0.76) translate(-256 -259)" style={{ stroke: fill, fill }} strokeLinecap="round">
        <line x1="118" y1="372" x2="182" y2="372" strokeWidth="52" />
        <line x1="330" y1="372" x2="394" y2="372" strokeWidth="52" />
        <circle cx="230" cy="372" r="10" stroke="none" fillOpacity="0.45" />
        <circle cx="256" cy="372" r="10" stroke="none" fillOpacity="0.45" />
        <circle cx="282" cy="372" r="10" stroke="none" fillOpacity="0.45" />
        <path d="M150 300 C 162 150, 330 120, 352 262" style={{ fill: "none" }} strokeWidth="46" />
        <path d="M299 260 L 402 244 L 361 321 Z" strokeWidth="18" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
