// PWA utility functions
export class PWAManager {
  private static instance: PWAManager;
  private swRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  public static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  // Register service worker
  async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.swRegistration = registration;
        console.log('Service Worker registered successfully');

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt user to reload
                this.showUpdateAvailable();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Check if app can be installed
  async canInstall(): Promise<boolean> {
    if ('getInstalledRelatedApps' in navigator) {
      const relatedApps = await (navigator as any).getInstalledRelatedApps();
      return relatedApps.length === 0;
    }
    return true;
  }

  // Show install prompt
  showInstallPrompt(deferredPrompt: Event): void {
    const installBanner = document.createElement('div');
    installBanner.className = 'install-banner';
    installBanner.innerHTML = `
      <div class="install-content">
        <span>Install Xclusive for a better experience!</span>
        <button id="install-btn" class="install-button">Install</button>
        <button id="dismiss-btn" class="dismiss-button">×</button>
      </div>
    `;

    document.body.appendChild(installBanner);

    // Handle install button click
    document.getElementById('install-btn')?.addEventListener('click', async () => {
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      installBanner.remove();
    });

    // Handle dismiss button click
    document.getElementById('dismiss-btn')?.addEventListener('click', () => {
      installBanner.remove();
    });
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service Worker not registered');
      return null;
    }

    try {
      // You would replace this with your actual VAPID public key
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';
      
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      // Send subscription to your backend
      await this.sendSubscriptionToBackend(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Send subscription to backend
  private async sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Failed to send subscription to backend:', error);
    }
  }

  // Show update available notification
  private showUpdateAvailable(): void {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'update-banner';
    updateBanner.innerHTML = `
      <div class="update-content">
        <span>New version available!</span>
        <button id="reload-btn" class="reload-button">Reload</button>
      </div>
    `;

    document.body.appendChild(updateBanner);

    document.getElementById('reload-btn')?.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // Add to home screen prompt for iOS
  showIOSInstallPrompt(): void {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone;

    if (isIOS && !isStandalone) {
      const iosPrompt = document.createElement('div');
      iosPrompt.className = 'ios-install-prompt';
      iosPrompt.innerHTML = `
        <div class="ios-install-content">
          <p>Install Xclusive: Tap <span class="share-icon">⎵</span> then "Add to Home Screen"</p>
          <button id="ios-dismiss" class="ios-dismiss-button">×</button>
        </div>
      `;

      document.body.appendChild(iosPrompt);

      document.getElementById('ios-dismiss')?.addEventListener('click', () => {
        iosPrompt.remove();
      });
    }
  }

  // Check if running as PWA
  isRunningAsPWA(): boolean {
    return (window.navigator as any).standalone || 
           window.matchMedia('(display-mode: standalone)').matches;
  }

  // Cache management
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }
}

// Initialize PWA manager
export const pwaManager = PWAManager.getInstance();