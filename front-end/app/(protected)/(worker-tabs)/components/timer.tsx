import { useEffect, useState } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
}

export const useCountdown = (targetDate: string, countdonw: number): TimeLeft => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false
    });

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeft => {
            const target = new Date(targetDate).getTime();
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    expired: true
                };
            }

            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
                expired: false
            };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, countdonw);

        // Actualizar inmediatamente
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
};