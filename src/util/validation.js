module.exports = {
	validateDimension(configuration, dimension) {
		return dimension < configuration.config.maxDimension;
	}
}