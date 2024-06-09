import { SVGProps } from "react";

export const Sun = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg height="48px" viewBox="0 0 48 48" width="48px" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11 11H37V37H11z" fill="#FF9800" />
      <path d="M11.272 11.272H36.728V36.728H11.272z" fill="#FF9800" transform="rotate(-45.001 24 24)" />
      <path
        d="M13,24c0,6.077,4.923,11,11,11c6.076,0,11-4.923,11-11s-4.924-11-11-11C17.923,13,13,17.923,13,24"
        fill="#FFEB3B"
      />
    </svg>
  );
};
