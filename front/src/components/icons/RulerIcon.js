import React from "react";

const RulerIcon = ({ fill = "#FFFF00", size = 35 }) => {
  const width = 400;
  const height = 400;
  const transform = `scale(${size / width}, ${size / height})`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <g transform={transform}>
        <path 
          id="path0"
          d="M154.466 154.472 C 69.574 239.368,0.118 308.878,0.118 308.940 C 0.118 309.003,20.673 329.609,45.797 354.733 L 91.476 400.411 245.681 246.208 C 330.494 161.396,399.872 91.948,399.855 91.879 C 399.806 91.683,309.088 0.118,308.943 0.118 C 308.872 0.118,239.357 69.577,154.466 154.472 M345.209 108.583 L 328.101 125.691 314.286 111.875 L 300.470 98.060 293.974 104.556 L 287.478 111.052 301.293 124.868 L 315.109 138.683 297.766 156.026 L 280.423 173.368 266.608 159.553 L 252.793 145.738 246.561 151.969 C 243.134 155.396,240.329 158.253,240.329 158.318 C 240.329 158.383,246.520 164.626,254.086 172.193 L 267.842 185.950 250.500 203.292 L 233.157 220.635 219.342 206.820 L 205.526 193.005 199.295 199.236 C 195.867 202.663,193.063 205.520,193.063 205.585 C 193.063 205.650,199.253 211.893,206.820 219.459 L 220.576 233.215 203.263 250.529 L 185.950 267.842 172.193 254.086 C 164.626 246.520,158.383 240.329,158.318 240.329 C 158.253 240.329,155.396 243.134,151.969 246.561 L 145.738 252.793 159.553 266.608 L 173.368 280.423 156.026 297.766 L 138.683 315.109 124.926 301.352 C 117.360 293.786,111.117 287.596,111.052 287.596 C 110.987 287.596,108.130 290.400,104.703 293.827 L 98.472 300.059 112.287 313.874 L 126.102 327.690 108.995 344.797 L 91.887 361.905 65.202 335.220 L 38.518 308.535 173.724 173.313 L 308.931 38.090 335.623 64.783 L 362.316 91.475 345.209 108.583 "
          stroke="none"
          fill={fill}
          fill-rule="evenodd">
        </path>
      </g>
    </svg>
  );
};

export default RulerIcon;