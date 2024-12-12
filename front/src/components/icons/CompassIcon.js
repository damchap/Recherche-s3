import React from "react";

const CompassIcon = ({ fill = "#FF5C59", size = 35 }) => {
  const width = 400;
  const height = 647;
  const transform = `scale(${(width * size /height) / width}, ${size / height})`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${width * size /height} ${size}`}
    >
      <g transform={transform}>
        <path 
          id="path0"
          d="M195.553 0.195 C 187.100 1.625,180.200 7.923,177.880 16.324 L 177.360 18.208 177.308 43.786 L 177.256 69.364 155.295 69.364 L 133.333 69.364 133.338 127.216 L 133.342 185.067 116.526 240.413 L 99.711 295.759 59.900 295.760 C 16.108 295.761,18.652 295.695,14.933 296.937 C -0.326 302.037,-4.861 321.875,6.610 333.346 C 9.533 336.269,12.697 338.005,17.534 339.341 C 18.203 339.526,26.155 339.604,52.335 339.684 L 86.269 339.788 62.310 418.497 L 38.351 497.206 38.406 543.931 C 38.467 595.029,38.385 591.350,39.528 594.792 C 41.470 600.640,45.974 605.654,51.407 608.015 L 52.890 608.660 52.987 616.710 L 53.083 624.759 56.717 635.614 C 58.716 641.584,60.418 646.397,60.499 646.308 C 60.579 646.219,62.260 641.291,64.234 635.356 L 67.823 624.566 67.823 616.658 L 67.823 608.751 69.448 608.018 C 76.284 604.940,81.062 598.610,82.188 591.138 C 82.421 589.590,82.464 582.668,82.465 546.466 L 82.466 503.626 107.370 421.662 L 132.274 339.699 154.757 339.695 L 177.240 339.692 177.310 348.892 C 177.393 359.975,177.663 361.387,180.582 366.025 C 189.692 380.500,211.434 379.318,218.938 363.940 C 220.925 359.868,221.195 357.923,221.195 347.674 L 221.195 339.692 243.627 339.692 L 266.059 339.692 266.259 340.318 C 266.369 340.662,277.583 377.490,291.178 422.158 L 315.896 503.372 315.992 547.495 L 316.089 591.618 316.619 593.545 C 318.404 600.027,323.261 605.670,329.191 608.152 L 330.347 608.636 330.443 616.697 L 330.539 624.759 334.168 635.597 C 336.164 641.558,337.855 646.435,337.927 646.435 C 337.998 646.435,339.682 641.557,341.668 635.595 L 345.279 624.755 345.279 616.753 L 345.279 608.751 346.965 607.993 C 352.531 605.493,356.884 600.651,358.845 594.782 C 359.973 591.404,359.921 593.880,359.922 543.329 L 359.923 496.967 336.031 418.443 C 322.890 375.256,312.139 339.869,312.139 339.806 C 312.139 339.743,327.474 339.692,346.218 339.692 C 383.467 339.692,381.707 339.742,385.164 338.570 C 400.304 333.432,405.050 314.106,393.999 302.595 C 391.344 299.829,388.602 298.054,385.259 296.937 C 381.537 295.693,384.179 295.761,339.386 295.761 L 298.668 295.761 298.092 293.882 C 297.776 292.849,290.186 267.882,281.225 238.400 L 264.933 184.796 264.933 127.080 L 264.933 69.364 243.064 69.364 L 221.195 69.364 221.195 45.033 C 221.195 19.517,221.175 18.858,220.316 15.849 C 217.272 5.180,206.465 -1.652,195.553 0.195 M222.238 195.809 C 222.777 197.548,252.170 294.216,252.527 295.424 C 252.622 295.743,251.789 295.761,236.925 295.761 L 221.222 295.761 221.140 286.850 C 221.044 276.503,220.926 275.671,218.973 271.594 C 211.171 255.304,187.533 255.169,179.504 271.370 C 177.491 275.434,177.267 277.027,177.265 287.331 L 177.264 295.761 161.488 295.761 L 145.712 295.761 146.904 291.859 C 147.560 289.713,154.551 266.737,162.439 240.800 L 176.782 193.642 199.174 193.642 L 221.567 193.642 222.238 195.809 "
          stroke="none"
          fill={fill}
          fill-rule="evenodd">
        </path>
      </g>
    </svg>
  );
};

export default CompassIcon;