'use strict';

const Homey = require('homey');

class PowerwallDevice extends Homey.Device {
	
	onInit() {
		this.log('MyDevice has been inited');
	}
	
}

module.exports = PowerwallDevice;