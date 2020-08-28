'use strict';

const Homey = require('homey');

class TeslaEnergy extends Homey.App {
	onInit() {
		this.log('Tesla Energy app is running');
	}
}

module.exports = TeslaEnergy;