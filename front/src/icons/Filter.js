function Filter({ fill }) {
  return (
    <svg width="400" height="400" viewBox="0, 0, 400,400">
      <g>
        <path
          d="M88.408 88.309 L 176.517 176.418 176.517 288.059 L 176.517 399.701 200.000 376.219 L 223.483 352.737 223.483 264.578 L 223.483 176.418 311.592 88.309 L 399.701 0.199 200.000 0.199 L 0.299 0.199 88.408 88.309 "
          stroke="none"
          fill={fill}
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export default Filter;