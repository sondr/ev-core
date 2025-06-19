export declare class Notificator {
    get permission(): NotificationPermission;
    requestPermission(): Promise<NotificationPermission>;
    notify(title: string, options?: NotificationOptions): Promise<Notification>;
}
