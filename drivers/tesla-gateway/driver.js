'use strict';

const Homey = require('homey');
const { TeslaGatewayApi } = require('./api');

class PowerwallDriver extends Homey.Driver {
	// To support:
	// Battery percentage
	// Solar production
	// Grid consumption
	// Home consumption
	// Battery consumption/production

	onPair(socket) {
		socket.on('validate', async ({ ipAddress }, callback) => {
			try {
				this.log(ipAddress);

				const teslaGatewayApi = new TeslaGatewayApi(ipAddress);
				const siteName = await teslaGatewayApi.getSiteName();

				callback(null, { siteName });
			} catch (error) {
				this.error(error);
				callback(error);
			}
		});
	}

}

module.exports = PowerwallDriver;