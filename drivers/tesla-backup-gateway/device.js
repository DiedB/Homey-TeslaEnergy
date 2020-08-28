'use strict';

const Homey = require('homey');
const { v4: uuidv4 } = require('uuid');
const { TeslaBackupGatewayApi } = require('./api');

class TeslaBackupGatewayDevice extends Homey.Device {
	onInit() {
		this.log('Initializing device');

		// Create/initialize cron task
		if (this.getStoreValue('cronTask') === null) {
			this.createCronTask();
		} else {
			this.initializeCronTask();
		}

		// Initialize API
		const settings = this.getSettings();

        try {
			this.teslaBackupGatewayApi = new TeslaBackupGatewayApi(settings.ipAddress);
			this.teslaBackupGatewayApi.connect();
        } catch (error) {
            this.setUnavailable(error);
        }
	}

    onAdded() {
        this.log('Added device');
    }

    onDeleted() {
        this.deleteCronTask();
        this.log('Deleted device');
	}

    initializeCronTask() {
        const taskName = this.getStoreValue('cronTask');
        Homey.ManagerCron.getTask(taskName)
            .then(result => {
                result.on('run', data => {
                    this.log(`Running task ${taskName}`);
                    this.updateDeviceState();
                });
                this.log(`Initialized cron job ${taskName}`);
            }).catch(error => {
                this.error(`Failed retrieving cron job ${taskName}`);
                this.createCronTask();
            });
    }
        
    createCronTask() {
        const taskName = uuidv4().replace(/[^a-zA-Z0-9]+/g,'');
        Homey.ManagerCron.registerTask(taskName, "*/5 * * * * *", this.getData())
            .then(task => {
                this.log(`Cron job ${taskName} created successfully`);
                this.setStoreValue('cronTask', taskName).catch(error => {
                    this.error('Failed setting cron task name');
                });
                this.initializeCronTask(taskName);
            }).catch(error => {
                this.error(`Cron job creation failed (${error})`);
            });
    }

    deleteCronTask() {
        const taskName = this.getStoreValue('cronTask');
        Homey.ManagerCron.unregisterTask(taskName)
            .then(result => {
                this.log('Cron job deleted successfully');
            }).catch(error => {
                this.error(`Cron job deletion failed (${error}`);
            });
	}

	async updateDeviceState() {
		// Updates capability values
		this.log("Updating Tesla Backup Gateway meter values");

		if (this.teslaBackupGatewayApi && this.teslaBackupGatewayApi.getConnectionStatus()) {
			try {
				const batterySoc = await this.teslaBackupGatewayApi.getBatterySoc();
				const meterAggregates = await this.teslaBackupGatewayApi.getMeterAggregates();

				if (!this.getAvailable()) {
					this.setAvailable();
				}

				this.setCapabilityValue("battery_soc", batterySoc)
				this.setCapabilityValue("grid_power", meterAggregates.site.instant_power);
				this.setCapabilityValue("battery_power", meterAggregates.battery.instant_power);
				this.setCapabilityValue("home_power", meterAggregates.load.instant_power)
				this.setCapabilityValue("solar_power", meterAggregates.solar.instant_power);
			} catch (error) {
                this.error(error);
				this.setUnavailable(error);
			}
		}
	}
}

module.exports = TeslaBackupGatewayDevice;