import { storage } from './storage';
import type { InsertNotification } from '@shared/schema';

export class NotificationService {
  private static broadcastFunction: ((userId: number, notification: any) => void) | null = null;
  private static pushFunction: ((userId: number, notification: any) => void) | null = null;

  static setBroadcastFunction(fn: (userId: number, notification: any) => void) {
    this.broadcastFunction = fn;
  }

  static setPushFunction(fn: (userId: number, notification: any) => void) {
    this.pushFunction = fn;
  }

  static async createNotification(data: InsertNotification): Promise<void> {
    try {
      const notification = await storage.createNotification(data);
      
      if (notification) {
        const notificationData = {
          id: notification.id,
          type: data.type,
          title: data.title,
          message: data.message,
          read: false,
          action_url: data.action_url,
          time_ago: 'just now',
          created_at: new Date().toISOString()
        };

        // Broadcast real-time notification if WebSocket is available
        if (this.broadcastFunction) {
          this.broadcastFunction(data.user_id, notificationData);
        }

        // Send push notification if available
        if (this.pushFunction) {
          this.pushFunction(data.user_id, notificationData);
        }
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  // Notification generators for different events
  static async notifyNewSubscriber(creatorId: number, fanId: number, tierName: string): Promise<void> {
    const fan = await storage.getUser(fanId);
    if (!fan) return;

    await this.createNotification({
      user_id: creatorId,
      type: 'new_subscriber',
      title: 'New Subscriber!',
      message: `${fan.display_name || fan.username} subscribed to your ${tierName} tier`,
      action_url: '/creator/subscribers',
      actor_id: fanId,
      entity_type: 'subscription',
      metadata: {
        tier_name: tierName
      }
    });
  }

  static async notifyNewMessage(recipientId: number, senderId: number, messagePreview: string): Promise<void> {
    const sender = await storage.getUser(senderId);
    if (!sender) return;

    await this.createNotification({
      user_id: recipientId,
      type: 'new_message',
      title: 'New Message',
      message: `${sender.display_name || sender.username}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      action_url: '/fan/messages',
      actor_id: senderId,
      entity_type: 'message',
      metadata: {}
    });
  }

  static async notifyNewComment(creatorId: number, commenterId: number, postId: number, postTitle: string, commentContent: string): Promise<void> {
    const commenter = await storage.getUser(commenterId);
    if (!commenter) return;

    await this.createNotification({
      user_id: creatorId,
      type: 'new_comment',
      title: 'New Comment',
      message: `${commenter.display_name || commenter.username} commented on "${postTitle}"`,
      action_url: `/creator/posts/${postId}`,
      actor_id: commenterId,
      entity_type: 'comment',
      entity_id: postId,
      metadata: {
        post_title: postTitle,
        comment_content: commentContent.substring(0, 100)
      }
    });
  }

  static async notifyNewPost(creatorId: number, subscriberIds: number[], postTitle: string, postId: number): Promise<void> {
    const creator = await storage.getUser(creatorId);
    if (!creator) return;

    for (const subscriberId of subscriberIds) {
      await this.createNotification({
        user_id: subscriberId,
        type: 'new_post',
        title: 'New Content',
        message: `${creator.display_name || creator.username} posted: ${postTitle}`,
        action_url: `/fan/posts/${postId}`,
        actor_id: creatorId,
        entity_type: 'post',
        entity_id: postId,
        metadata: {
          post_title: postTitle
        }
      });
    }
  }

  static async notifyPaymentSuccess(userId: number, amount: string, tierName: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'payment_success',
      title: 'Payment Successful',
      message: `Your payment of GHS ${amount} for ${tierName} was processed successfully`,
      action_url: '/fan/subscriptions',
      entity_type: 'payment',
      metadata: {
        amount,
        tier_name: tierName
      }
    });
  }

  static async notifyPaymentFailed(userId: number, amount: string, tierName: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `Your payment of GHS ${amount} for ${tierName} could not be processed`,
      action_url: '/fan/payment-methods',
      entity_type: 'payment',
      metadata: {
        amount,
        tier_name: tierName
      }
    });
  }

  static async notifyPayoutCompleted(creatorId: number, amount: string): Promise<void> {
    await this.createNotification({
      user_id: creatorId,
      type: 'payout_completed',
      title: 'Payout Completed',
      message: `Your payout of GHS ${amount} has been processed successfully`,
      action_url: '/creator/payouts',
      entity_type: 'payment',
      metadata: {
        amount
      }
    });
  }

  static async notifyPostLike(creatorId: number, likerId: number, postId: number, postTitle: string): Promise<void> {
    const liker = await storage.getUser(likerId);
    if (!liker) return;

    await this.createNotification({
      user_id: creatorId,
      type: 'like',
      title: 'New Like',
      message: `${liker.display_name || liker.username} liked your post "${postTitle}"`,
      action_url: `/creator/posts/${postId}`,
      actor_id: likerId,
      entity_type: 'post',
      entity_id: postId,
      metadata: {
        post_title: postTitle
      }
    });
  }
}