import PropTypes from 'prop-types';

const Icon = props => {
  const styles = {
    svg: {
      display: 'inline-block',
    },
    path: {
      fill: props.color,
    },
  };

  return (
    <svg
      style={styles.svg}
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
    >
      <path
        style={styles.path}
        d={props.icon}
      ></path>
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: "16px",
};

export default Icon;