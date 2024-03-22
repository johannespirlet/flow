import PropTypes from 'prop-types';

const Icon = ({ icon, size = '16px', color }) => {
	const styles = {
		svg: {
			display: 'inline-block',
		},
		path: {
			fill: color,
		},
	};

	return (
		<svg style={styles.svg} width={size} height={size} viewBox="0 0 24 24">
			<path style={styles.path} d={icon}></path>
		</svg>
	);
};

Icon.propTypes = {
	icon: PropTypes.string.isRequired,
	size: PropTypes.string,
	color: PropTypes.string,
};

export default Icon;
