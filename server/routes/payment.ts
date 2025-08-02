import express from 'express';
import { paymentService } from '../services/paymentService';
import { storage } from '../storage';

const router = express.Router();

// Initialize payment for subscription
router.post('/initialize', async (req, res) => {
  try {
    const { fan_id, tier_id, payment_method = 'card' } = req.body;

    // Validate required fields
    if (!fan_id || !tier_id) {
      return res.status(400).json({
        success: false,
        message: 'Fan ID and Tier ID are required'
      });
    }

    // Get fan details
    const fan = await storage.getUser(fan_id);
    if (!fan) {
      return res.status(404).json({
        success: false,
        message: 'Fan not found'
      });
    }

    // Get tier details
    const tier = await storage.getSubscriptionTier(tier_id);
    if (!tier) {
      return res.status(404).json({
        success: false,
        message: 'Subscription tier not found'
      });
    }

    // Check if fan already has active subscription to this creator
    const existingSubscription = await storage.getUserSubscriptionToCreator(fan_id, tier.creator_id);
    if (existingSubscription && existingSubscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription to this creator'
      });
    }

    // Initialize payment
    const paymentData = await paymentService.createSubscriptionPayment(
      fan_id,
      tier_id,
      parseFloat(tier.price),
      fan.email
    );

    res.json({
      success: true,
      data: paymentData.data,
      message: 'Payment initialized successfully'
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment initialization failed'
    });
  }
});

// Initialize mobile money payment
router.post('/mobile-money/initialize', async (req, res) => {
  try {
    const { fan_id, tier_id, phone, provider = 'mtn' } = req.body;

    // Validate required fields
    if (!fan_id || !tier_id || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Fan ID, Tier ID, and phone number are required'
      });
    }

    // Validate provider
    const validProviders = ['mtn', 'vod', 'tgo', 'airtel'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile money provider. Use: mtn, vod, tgo, or airtel'
      });
    }

    // Get fan details
    const fan = await storage.getUser(fan_id);
    if (!fan) {
      return res.status(404).json({
        success: false,
        message: 'Fan not found'
      });
    }

    // Get tier details
    const tier = await storage.getSubscriptionTier(tier_id);
    if (!tier) {
      return res.status(404).json({
        success: false,
        message: 'Subscription tier not found'
      });
    }

    // Initialize mobile money payment
    const paymentData = await paymentService.initializeMobileMoneyPayment({
      email: fan.email,
      amount: parseFloat(tier.price),
      phone,
      provider: provider as 'mtn' | 'vod' | 'tgo' | 'airtel'
    });

    res.json({
      success: true,
      data: paymentData.data,
      message: 'Mobile money payment initialized successfully'
    });
  } catch (error: any) {
    console.error('Mobile money payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Mobile money payment initialization failed'
    });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    console.log('🔍 Verifying payment with reference:', reference);
    const verificationResult = await paymentService.verifyPayment(reference);
    console.log('✅ Payment verification result:', verificationResult.data.status);

    if (verificationResult.data.status === 'success') {
      console.log('💳 Processing successful payment...');
      // Process successful payment
      await paymentService.processSuccessfulPayment(verificationResult.data);
      console.log('✅ Payment processing completed successfully');
    }

    res.json({
      success: true,
      data: verificationResult.data,
      message: 'Payment verified successfully'
    });
  } catch (error: any) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
});

// Get payment config (public key for frontend)
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      public_key: paymentService.getPublicKey(),
      currency: 'GHS'
    }
  });
});

// Paystack webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const payload = req.body.toString();

    // Validate webhook signature
    if (!paymentService.validateWebhookSignature(payload, signature)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = JSON.parse(payload);

    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        await paymentService.processSuccessfulPayment(event.data);
        break;
      case 'charge.failed':
        console.log('Payment failed:', event.data);
        break;
      case 'subscription.create':
        console.log('Subscription created:', event.data);
        break;
      case 'subscription.disable':
        console.log('Subscription disabled:', event.data);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

export default router;