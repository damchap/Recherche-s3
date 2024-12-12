import React from "react";

const HandshakeIcon = ({ fill = "#DCEAF7", size = 35 }) => {
  const width = 400;
  const height = 240;
  const transform = `scale(${size / width}, ${(height * size /width) / height})`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${height * size /width}`}
    >
      <g transform={transform}>
        <path 
          id="path0"
          d="M51.105 2.328 C 22.678 49.169,-0.000 86.602,-0.000 86.685 C -0.000 86.820,36.006 108.798,36.758 109.123 C 40.573 110.770,45.553 109.292,47.547 105.921 C 47.740 105.596,57.579 89.308,69.412 69.725 C 81.245 50.143,91.114 33.750,91.343 33.297 C 93.389 29.249,91.840 24.161,87.857 21.846 C 87.495 21.636,79.459 16.677,70.000 10.826 C 60.541 4.976,52.725 0.168,52.631 0.142 C 52.508 0.108,52.085 0.715,51.105 2.328 M330.824 10.392 C 321.577 16.040,313.418 21.015,312.692 21.448 C 308.577 23.901,306.879 27.507,307.911 31.603 C 308.253 32.962,307.802 32.199,330.478 69.725 C 342.311 89.308,352.150 105.596,352.343 105.921 C 354.337 109.292,359.317 110.770,363.132 109.123 C 363.886 108.797,399.890 86.819,399.890 86.685 C 399.890 86.625,389.225 68.840,376.190 47.162 C 363.155 25.484,351.458 6.029,350.195 3.929 C 348.933 1.828,347.841 0.113,347.769 0.116 C 347.696 0.119,340.071 4.744,330.824 10.392 M200.495 37.438 C 196.458 37.962,192.761 39.632,189.967 42.195 C 189.060 43.026,151.955 85.318,151.125 86.466 C 146.850 92.380,146.677 100.798,150.709 106.805 C 157.568 117.023,172.544 118.309,180.249 109.341 C 186.847 101.661,218.323 65.722,218.419 65.759 C 218.489 65.786,227.293 73.338,237.982 82.542 C 248.672 91.746,266.665 107.237,277.967 116.968 C 289.269 126.698,299.901 135.853,301.593 137.312 C 305.576 140.745,307.643 142.923,309.359 145.495 L 309.543 145.769 309.924 145.385 C 310.699 144.602,342.747 107.568,342.747 107.455 C 342.747 107.367,303.871 43.668,303.663 43.415 C 303.642 43.390,302.401 43.772,300.906 44.265 C 285.169 49.453,270.757 50.645,253.548 48.180 C 246.551 47.178,240.651 45.916,226.538 42.400 C 217.040 40.033,212.685 39.019,207.961 38.073 L 204.411 37.363 202.618 37.379 C 201.631 37.388,200.676 37.415,200.495 37.438 M96.551 41.896 C 95.474 43.593,56.703 107.869,56.704 107.956 C 56.705 108.078,87.856 144.316,88.007 144.370 C 88.052 144.386,91.049 140.984,94.667 136.810 C 101.336 129.114,101.755 128.661,103.340 127.424 C 109.214 122.839,117.908 121.511,125.319 124.067 C 133.796 126.990,139.408 134.195,140.342 143.352 C 140.493 144.835,140.504 144.876,140.743 144.798 C 147.476 142.611,154.390 143.244,160.150 146.576 C 166.577 150.294,171.302 158.124,171.317 165.082 C 171.318 165.611,171.356 166.044,171.402 166.044 C 171.448 166.044,172.029 165.923,172.693 165.774 C 179.169 164.330,184.755 165.546,190.397 169.628 C 194.319 172.466,197.399 178.069,197.971 183.407 C 198.094 184.559,198.056 184.508,198.653 184.323 C 203.566 182.807,209.482 183.727,213.322 186.603 C 220.601 192.055,223.448 200.746,220.429 208.297 C 219.258 211.224,219.044 211.501,209.341 222.624 C 204.959 227.648,201.374 231.801,201.374 231.854 C 201.374 232.227,207.931 237.091,209.396 237.804 C 221.702 243.797,235.496 235.255,235.542 221.613 L 235.549 219.544 235.879 219.610 C 244.630 221.367,253.704 215.540,256.150 206.593 C 256.614 204.898,256.742 203.861,256.750 201.752 L 256.758 199.712 257.363 199.863 C 259.668 200.439,263.456 200.054,266.394 198.945 C 274.361 195.937,279.422 186.929,277.671 178.873 C 277.386 177.566,277.351 177.602,278.454 178.074 C 288.027 182.171,299.516 177.040,302.807 167.198 C 304.015 163.586,304.134 157.131,303.053 153.901 C 302.314 151.693,300.977 149.545,299.107 147.560 C 298.782 147.216,281.901 132.705,261.593 115.314 C 241.286 97.923,223.496 82.628,222.061 81.325 C 220.626 80.022,219.406 78.956,219.350 78.956 C 219.294 78.956,212.147 87.091,203.468 97.033 C 194.789 106.975,187.090 115.741,186.361 116.511 C 182.274 120.830,177.565 123.243,171.154 124.305 C 169.845 124.522,164.485 124.486,162.933 124.250 C 155.937 123.186,150.647 120.160,145.913 114.513 C 137.554 104.541,137.437 89.441,145.638 79.176 C 146.024 78.692,152.411 71.306,159.830 62.761 C 168.880 52.338,173.276 47.198,173.185 47.142 C 172.520 46.730,161.953 46.610,157.253 46.961 C 155.832 47.067,152.124 47.371,149.011 47.637 C 123.714 49.800,112.025 48.571,98.360 42.312 C 96.707 41.554,96.760 41.567,96.551 41.896 M115.925 133.357 C 113.234 133.845,110.576 135.185,108.638 137.031 C 107.769 137.859,83.392 165.367,82.603 166.410 C 79.328 170.741,79.241 177.130,82.390 182.033 C 87.003 189.213,97.059 190.185,103.548 184.078 C 105.009 182.702,129.008 155.456,129.799 154.275 C 134.439 147.343,130.971 136.831,123.096 133.956 C 121.067 133.216,118.083 132.967,115.925 133.357 M146.325 153.578 C 143.237 154.156,140.408 155.728,138.227 158.078 C 137.088 159.305,116.633 182.965,116.139 183.626 C 112.311 188.756,113.094 196.704,117.897 201.475 C 123.073 206.617,132.084 206.587,137.107 201.410 C 137.915 200.577,159.386 175.782,159.918 175.067 C 165.379 167.733,161.190 156.147,152.216 153.767 C 150.864 153.408,147.763 153.309,146.325 153.578 M175.824 175.237 C 173.102 175.772,171.093 176.827,169.335 178.644 C 168.262 179.754,147.611 203.499,147.047 204.272 C 144.346 207.973,144.394 213.651,147.161 217.654 C 150.897 223.058,159.539 223.988,164.142 219.482 C 164.832 218.806,186.134 194.306,186.914 193.291 C 189.156 190.372,189.666 185.570,188.120 181.931 C 186.803 178.833,183.988 176.385,180.714 175.492 C 179.850 175.256,176.591 175.086,175.824 175.237 M200.714 193.899 C 199.305 194.209,198.173 194.737,196.952 195.655 C 196.264 196.172,177.969 217.177,177.159 218.379 C 174.171 222.816,175.933 229.565,180.664 231.806 C 184.163 233.464,188.512 232.825,191.048 230.281 C 191.632 229.695,208.277 210.495,209.743 208.715 C 213.125 204.612,212.148 197.908,207.762 195.113 C 205.850 193.895,202.980 193.400,200.714 193.899 "
          stroke="none"
          fill={fill}
          fill-rule="evenodd">
        </path>
      </g>
    </svg>
  );
};

export default HandshakeIcon;