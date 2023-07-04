import PairSession from "homey/lib/PairSession";
import { TeslaEnergyDevice } from "./types";
import { Driver } from "homey";

import TeslaBackupGatewayApi from "./api";

class TeslaBackupGatewayDriver extends Driver {
  async onPair(session: PairSession) {
    let pairIpAddress: string | null = null;
    let devices: TeslaEnergyDevice[] = [];

    session.setHandler("ip_address", async ({ ipAddress }) => {
      pairIpAddress = ipAddress;
      await session.nextView();

      return true;
    });

    session.setHandler("login", async ({ username, password }) => {
      if (!pairIpAddress) {
        throw new Error(
          "IP address not found while it is required during login"
        );
      }

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
        data: {
          id: siteName,
        },
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
