import { useState, useEffect, useCallback } from 'react';

export type NotificationPermissionState =
  | 'default'
  | 'granted'
  | 'denied'
  | 'unsupported';

interface NotificationPermissionHook {
  permission: NotificationPermissionState;
  isSupported: boolean;
  canShowNotifications: boolean;
  isBlocked: boolean;
  isPending: boolean;
  requestPermission: () => Promise<NotificationPermissionState>;
}

export const useNotificationPermission = (): NotificationPermissionHook => {
  const [permission, setPermission] =
    useState<NotificationPermissionState>('default');
  const [isSupported, setIsSupported] = useState(false);

  // Check initial permission state
  useEffect(() => {
    const checkPermission = () => {
      if (!('Notification' in window)) {
        setPermission('unsupported');
        setIsSupported(false);
        return;
      }

      setIsSupported(true);
      setPermission(Notification.permission as NotificationPermissionState);
    };

    checkPermission();

    // Listen for permission changes (some browsers support this)
    const handlePermissionChange = () => {
      if ('Notification' in window) {
        setPermission(Notification.permission as NotificationPermissionState);
      }
    };

    // Some browsers support permission change events
    if ('permissions' in navigator && 'query' in navigator.permissions) {
      navigator.permissions
        .query({ name: 'notifications' as PermissionName })
        .then((permissionStatus) => {
          permissionStatus.addEventListener('change', handlePermissionChange);
          return () => {
            permissionStatus.removeEventListener(
              'change',
              handlePermissionChange,
            );
          };
        })
        .catch(() => {
          // Permission API not supported, fallback to manual checking
        });
    }
  }, []);

  const requestPermission =
    useCallback(async (): Promise<NotificationPermissionState> => {
      if (!isSupported) {
        return 'unsupported';
      }

      if (permission === 'granted') {
        return 'granted';
      }

      if (permission === 'denied') {
        return 'denied';
      }

      try {
        // Request permission
        const result = await Notification.requestPermission();
        setPermission(result as NotificationPermissionState);
        return result as NotificationPermissionState;
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        setPermission('denied');
        return 'denied';
      }
    }, [isSupported, permission]);

  return {
    permission,
    requestPermission,
    isSupported,
    canShowNotifications: permission === 'granted',
    isBlocked: permission === 'denied',
    isPending: permission === 'default',
  };
};
