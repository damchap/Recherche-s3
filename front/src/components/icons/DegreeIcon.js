import React from "react";

const DegreeIcon = ({ fill = "#8854AF", size = 35 }) => {
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
          d="M196.593 0.066 C 196.382 0.090,195.739 0.162,195.165 0.226 C 176.630 2.306,161.496 16.486,158.085 34.966 C 154.162 56.221,167.352 77.150,188.544 83.295 L 189.341 83.526 189.313 120.134 L 189.286 156.742 187.747 157.052 C 174.321 159.755,162.291 168.137,154.705 180.075 C 153.878 181.377,153.666 181.641,153.496 181.587 C 153.143 181.475,85.368 153.097,85.307 153.036 C 85.275 153.004,85.308 152.518,85.380 151.956 C 86.106 146.293,85.297 139.054,83.288 133.238 C 73.021 103.516,34.573 94.794,12.306 117.135 C -6.178 135.680,-3.506 166.925,17.857 182.054 C 36.043 194.934,61.964 191.313,75.199 174.045 C 75.694 173.400,76.127 172.868,76.161 172.864 C 76.195 172.860,91.970 179.298,111.217 187.170 L 146.211 201.484 146.079 202.198 C 145.552 205.061,145.616 211.486,146.215 215.769 C 147.406 224.279,150.526 232.187,155.357 238.942 L 156.290 240.247 153.601 242.953 C 152.122 244.442,140.415 256.266,127.584 269.231 C 114.753 282.195,103.553 293.511,102.695 294.378 L 101.134 295.953 99.550 295.125 C 73.159 281.319,41.472 297.427,37.536 326.648 C 33.487 356.719,60.765 381.009,90.231 373.571 C 117.080 366.793,130.008 336.387,116.526 311.722 L 116.116 310.972 144.250 282.838 L 172.383 254.705 173.692 255.449 C 189.455 264.416,210.311 264.410,226.307 255.436 L 227.615 254.703 255.734 282.821 L 283.852 310.940 282.974 312.645 C 269.554 338.693,284.781 370.089,313.132 374.827 C 342.337 379.708,367.094 354.876,362.190 325.622 C 357.421 297.174,325.334 281.848,299.959 295.896 L 298.865 296.502 297.025 294.652 C 287.540 285.121,243.810 240.905,243.771 240.808 C 243.744 240.738,244.027 240.268,244.401 239.764 C 249.343 233.100,252.707 224.674,253.784 216.264 C 254.376 211.639,254.379 203.713,253.788 202.175 C 253.695 201.932,323.707 173.327,323.897 173.530 C 323.975 173.613,324.546 174.290,325.165 175.034 C 338.384 190.924,362.072 194.976,379.208 184.278 C 406.102 167.489,406.876 128.909,380.659 111.956 C 355.709 95.823,322.283 109.366,315.443 138.381 C 314.465 142.526,314.076 149.263,314.614 152.731 C 314.683 153.175,314.724 153.552,314.705 153.569 C 314.686 153.586,305.250 157.541,293.736 162.358 C 282.223 167.175,266.822 173.619,259.513 176.678 C 252.203 179.738,246.207 182.194,246.188 182.137 C 246.169 182.080,245.819 181.502,245.412 180.853 C 238.011 169.066,225.460 160.320,211.952 157.536 L 210.714 157.281 210.687 120.395 C 210.665 90.940,210.687 83.501,210.797 83.469 C 219.780 80.784,226.616 76.494,232.172 70.055 C 254.296 44.415,239.057 4.877,205.275 0.266 C 203.979 0.089,197.698 -0.055,196.593 0.066 "
          stroke="none"
          fill={fill}
          fill-rule="evenodd">
        </path>
      </g>
    </svg>
  );
};

export default DegreeIcon;