"use client";
import { useEffect } from "react";

const NOTIFICATIONS = [
    { time: "06:00", title: "Angelus & Morning Word", body: "It's 6 AM. Time for the Angelus and your daily liturgical nourishment." },
    { time: "12:00", title: "Angelus", body: "The Angel of the Lord declared unto Mary. Let us pray." },
    { time: "15:00", title: "Divine Mercy", body: "3 PM: The Hour of Great Mercy. Jesus, I trust in You." },
    { time: "18:00", title: "Angelus", body: "Evening Angelus. The Word was made flesh and dwelt among us." },
    { time: "22:00", title: "Night Prayers", body: "Time for your daily examen and night prayers before rest." },
];

export default function NotificationManager() {
    useEffect(() => {
        if (!("Notification" in window)) return;

        const requestPermission = async () => {
            if (Notification.permission === "default") {
                await Notification.requestPermission();
            }
        };

        requestPermission();

        const scheduleNotifications = () => {
            const now = new Date();

            NOTIFICATIONS.forEach((n) => {
                const [hours, minutes] = n.time.split(":").map(Number);
                const scheduledTime = new Date();
                scheduledTime.setHours(hours, minutes, 0, 0);

                if (scheduledTime < now) {
                    scheduledTime.setDate(scheduledTime.getDate() + 1);
                }

                const delay = scheduledTime.getTime() - now.getTime();

                setTimeout(() => {
                    if (Notification.permission === "granted") {
                        new Notification(n.title, {
                            body: n.body,
                            icon: "/images/logo.png",
                            badge: "/images/logo.png",
                            tag: n.time,
                        });
                    }
                    // Reschedule for next day after it triggers
                    setTimeout(scheduleNotifications, 1000);
                }, delay);
            });
        };

        if (Notification.permission === "granted") {
            scheduleNotifications();
        }
    }, []);

    return null;
}
