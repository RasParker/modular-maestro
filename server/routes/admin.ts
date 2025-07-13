
import express from 'express';
import { cronService } from '../services/cronService';
import { payoutService } from '../services/payoutService';

const router = express.Router();

// Manually trigger monthly payouts (for testing/admin use)
router.post('/trigger-monthly-payouts', async (req, res) => {
  try {
    // In production, add proper admin authentication here
    await cronService.triggerMonthlyPayouts();
    
    res.json({
      success: true,
      message: 'Monthly payouts triggered successfully'
    });
  } catch (error: any) {
    console.error('Error triggering monthly payouts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to trigger monthly payouts'
    });
  }
});

// Get admin payout dashboard data
router.get('/payout-dashboard', async (req, res) => {
  try {
    const stats = await payoutService.getPayoutStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching admin payout dashboard:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payout dashboard data'
    });
  }
});

export default router;
