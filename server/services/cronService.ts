
import cron from 'node-cron';
import { payoutService } from './payoutService';

export class CronService {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  // Start all scheduled jobs
  start(): void {
    console.log('Starting cron service...');
    
    // Schedule monthly payouts (1st of every month at 9:00 AM)
    const monthlyPayoutJob = cron.schedule('0 9 1 * *', async () => {
      console.log('Running scheduled monthly payout processing...');
      try {
        await payoutService.processMonthlyPayouts();
        console.log('Scheduled monthly payout processing completed');
      } catch (error) {
        console.error('Error in scheduled monthly payout processing:', error);
      }
    }, {
      scheduled: false,
      timezone: 'Africa/Accra' // Ghana timezone
    });

    this.jobs.set('monthly-payouts', monthlyPayoutJob);
    monthlyPayoutJob.start();

    // Schedule weekly payout status checks (every Monday at 10:00 AM)
    const weeklyStatusJob = cron.schedule('0 10 * * 1', async () => {
      console.log('Running weekly payout status check...');
      try {
        await this.checkPendingPayouts();
        console.log('Weekly payout status check completed');
      } catch (error) {
        console.error('Error in weekly payout status check:', error);
      }
    }, {
      scheduled: false,
      timezone: 'Africa/Accra'
    });

    this.jobs.set('weekly-status-check', weeklyStatusJob);
    weeklyStatusJob.start();

    console.log('Cron service started with scheduled jobs:');
    console.log('- Monthly payouts: 1st of every month at 9:00 AM');
    console.log('- Weekly status checks: Every Monday at 10:00 AM');
  }

  // Stop all scheduled jobs
  stop(): void {
    console.log('Stopping cron service...');
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped job: ${name}`);
    });
    this.jobs.clear();
  }

  // Check and retry pending payouts
  private async checkPendingPayouts(): Promise<void> {
    console.log('Checking pending payouts...');
    // Implementation would check for payouts stuck in pending status
    // and retry them or mark them as failed after a certain time
  }

  // Manual trigger for monthly payouts (for testing/admin use)
  async triggerMonthlyPayouts(): Promise<void> {
    console.log('Manually triggering monthly payout processing...');
    await payoutService.processMonthlyPayouts();
  }
}

export const cronService = new CronService();
