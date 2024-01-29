import { Device } from "homey";

import TeslaBackupGatewayApi from "./api";
import { TeslaEnergyDeviceSettings } from "./types";

class TeslaBackupGatewayDevice extends Device {
  teslaBackupGatewayApi?: TeslaBackupGatewayApi;
  updateInterval?: NodeJS.Timeout;

  async onInit() {
    this.log("Initializing device");

    // Initialize API client
    const { ipAddress, username, password } = this.getSettings();

    this.teslaBackupGatewayApi = new TeslaBackupGatewayApi(
      ipAddress,
      username,
      password
    );

    // On app upgrade
    if (!username || !password) {
      this.setWarning(
        "Please set your Tesla Backup Gateway username and password in the device settings"
      );
    }

    // Add any missing capabilities due to app updates
    await this.updateCapabilities();

    // Initialize update interval
    this.updateInterval = this.homey.setInterval(
      this.updateDeviceState.bind(this),
      5000
    );
  }

  async onSettings({ newSettings }: { newSettings: object }) {
    const { ipAddress, username, password } =
      newSettings as TeslaEnergyDeviceSettings;

    this.teslaBackupGatewayApi = new TeslaBackupGatewayApi(
      ipAddress,
      username,
      password
    );

    if (username && password) {
      this.unsetWarning();
    }
  }

  onDeleted() {
    this.homey.clearInterval(this.updateInterval);
  }

  // Add capabilities if not attached to device
  async updateCapabilities(){
    if (!this.hasCapability("measure_battery")) {
      await this.addCapability("measure_battery");
    }

    if (!this.hasCapability('alarm_off_grid')){
        await this.addCapability('alarm_off_grid');
    }
  }

  async updateDeviceState() {
    // Updates capability values
    this.log("Updating Tesla Backup Gateway meter values");

    if (this.teslaBackupGatewayApi) {
      try {
        // TODO: dynamically handle session refresh
        await this.teslaBackupGatewayApi.login();

        const batterySoc = await this.teslaBackupGatewayApi.getBatterySoc();
        const meterAggregates =
          await this.teslaBackupGatewayApi.getMeterAggregates();
        const gridStatus = await this.teslaBackupGatewayApi.getGridStatus();

        if (!this.getAvailable()) {
          this.setAvailable();
        }

        this.setCapabilityValue("battery_soc", batterySoc);
        this.setCapabilityValue("measure_battery", batterySoc);
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

        var solarInstantPower = 0;  // Solar value returned should never be <0 but the Powerwall Api does return <0 even at nighttime
        if(meterAggregates.solar.instant_power > 0) {
          solarInstantPower = meterAggregates.solar.instant_power;
        }
        this.setCapabilityValue("solar_power", solarInstantPower);
        
        var offGrid = false;
        if(gridStatus.grid_status != 'SystemGridConnected') {
          offGrid = true;
        }
        this.setCapabilityValue("alarm_off_grid", offGrid);

      } catch (error: unknown) {
        this.error(error);
        this.setUnavailable(
          "Could not refresh Tesla Backup Gateway data due to an unknown error"
        );
      }
    } else {
      this.log("Tesla Backup Gateway is not initialized");
    }
  }
}

module.exports = TeslaBackupGatewayDevice;
