"use strict";

const Homey = require("homey");
const { TeslaBackupGatewayApi } = require("./api");

class TeslaBackupGatewayDriver extends Homey.Driver {
    onPair(session) {
        let pairIpAddress;
        let devices = [];

        session.setHandler("ip_address", async ({ ipAddress }) => {
            this.log(ipAddress);
            pairIpAddress = ipAddress;
            await session.nextView();
        });

        session.setHandler("login", async ({ username, password }) => {
            const teslaBackupGatewayApi = new TeslaBackupGatewayApi(
                ipAddress,
                username,
                password
            );

            // TODO: return to previous page when necessary
            await teslaBackupGatewayApi.login();

            const siteName = await teslaBackupGatewayApi.getSiteName();

            // TODO: add settings to driver.compose.json
            devices.push({
                name: siteName,
                data: {},
                settings: { ipAddress, username, password },
            });

            await session.nextView();
        });

        session.setHandler("list_devices", async () => {
            return devices;
        });
    }
}

module.exports = TeslaBackupGatewayDriver;
