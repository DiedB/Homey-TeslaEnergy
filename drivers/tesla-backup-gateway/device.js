"use strict";

const Homey = require("homey");
const { TeslaBackupGatewayApi } = require("./api");

class TeslaBackupGatewayDevice extends Homey.Device {
    async onInit() {
        this.log("Initializing device");

        // Initialize API client
        const { ipAddress, username, password } = this.getSettings();

        this.teslaBackupGatewayApi = new TeslaBackupGatewayApi(
            ipAddress,
            username,
            password
        );

        await this.teslaBackupGatewayApi.login();

        // Initialize timeout handler
        this.homey.setTimeout(this.updateDeviceState.bind(this), 5000);
    }

    async updateDeviceState() {
        // Updates capability values
        this.log("Updating Tesla Backup Gateway meter values");

        if (this.teslaBackupGatewayApi) {
            try {
                const batterySoc = await this.teslaBackupGatewayApi.getBatterySoc();
                const meterAggregates = await this.teslaBackupGatewayApi.getMeterAggregates();

                if (!this.getAvailable()) {
                    this.setAvailable();
                }

                this.setCapabilityValue("battery_soc", batterySoc);
                this.setCapabilityValue(
                    "grid_power",
                    meterAggregates.site.instant_power
                );
                this.setCapabilityValue(
                    "battery_power",
                    meterAggregates.battery.instant_power
                );
                this.setCapabilityValue(
                    "home_power",
                    meterAggregates.load.instant_power
                );
                this.setCapabilityValue(
                    "solar_power",
                    meterAggregates.solar.instant_power
                );

                this.unsetWarning();
            } catch (error) {
                this.error(error);
                this.setUnavailable(error);
            }
        } else {
            // TODO: Remove unnecessary logging
            this.log("Tesla Backup Gateway is not initialized");
        }
    }
}

module.exports = TeslaBackupGatewayDevice;
