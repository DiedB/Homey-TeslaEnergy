'use strict';

const Homey = require('homey');
const { TeslaBackupGatewayApi } = require('./api');

class TeslaBackupGatewayDriver extends Homey.Driver {
	onPair(socket) {
		socket.on('validate', async ({ ipAddress }, callback) => {
			try {
				const teslaBackupGatewayApi = new TeslaBackupGatewayApi(ipAddress);
				await teslaBackupGatewayApi.connect();

				const siteName = await teslaBackupGatewayApi.getSiteName();

				callback(null, { siteName });
			} catch (error) {
				this.error(error);
				callback(error);
			}
		});
	}

}

module.exports = TeslaBackupGatewayDriver;