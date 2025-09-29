import { Button, Typography } from '@/components';

interface NotificationInfoProps {
  isSupported: boolean;
  permission: string;
  isPending: boolean;
  isBlocked: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  onRequest: () => void;
}

export const NotificationInfo = ({
  isSupported,
  isPending,
  isBlocked,
  isIOS,
  isStandalone,
  onRequest,
}: NotificationInfoProps) => {
  if (!isSupported) {
    return (
      <Typography className="text-destructive">
        Notifications are not supported on this browser/device.
      </Typography>
    );
  }

  return (
    <>
      {isPending && (
        <Button onClick={onRequest} variant="outline">
          Enable Notifications
        </Button>
      )}

      {isBlocked && (
        <Typography className="text-destructive">
          Notifications are blocked. Please enable them in your browser
          settings.
        </Typography>
      )}

      {isIOS && !isStandalone && (
        <Typography className="text-warning">
          On iOS, push notifications only work when the app is installed to the
          Home Screen.
        </Typography>
      )}
    </>
  );
};
