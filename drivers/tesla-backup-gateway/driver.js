"use strict";

const Homey = require("homey");
const { TeslaBackupGatewayApi } = require("./api");

class TeslaBackupGatewayDriver extends Homey.Driver {
    onPair(session) {
        let pairIpAddress;
        let devices = [];

        session.setHandler("ip_address", async ({ ipAddress }) => {
            pairIpAddress = ipAddress;
            await session.nextView();

            return true;
        });

        session.setHandler("login", async ({ username, password }) => {
            const teslaBackupGatewayApi = new TeslaBackupGatewayApi(
                pairIpAddress,
                username,
                password
            );

            // TODO: return to previous page when necessary (on ECONNREFUSED)
            await teslaBackupGatewayApi.login();
            const siteName = await teslaBackupGatewayApi.getSiteName();

            devices.push({
                name: siteName,
                data: {},
                settings: { ipAddress: pairIpAddress, username, password },
            });

            return true;
        });

        session.setHandler("list_devices", async () => {
            return devices;
        });
    }
}

module.exports = TeslaBackupGatewayDriver;
