import Homey from "homey";

class TeslaEnergy extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit(): Promise<void> {
    this.homey.log("Tesla Energy app is running");
  }
}

module.exports = TeslaEnergy;
