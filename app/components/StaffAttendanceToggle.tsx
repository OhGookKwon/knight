'use client';

import { useState } from "react";
import { toggleStaffWorking } from "@/app/actions/staff";
import { Loader2 } from "lucide-react";

interface StaffAttendanceToggleProps {
    staffId: string;
    storeId: string;
    initialIsWorking: boolean;
}

export default function StaffAttendanceToggle({ staffId, storeId, initialIsWorking }: StaffAttendanceToggleProps) {
    const [isWorking, setIsWorking] = useState(initialIsWorking);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        const newState = !isWorking;

        try {
            // Optimistic Update
            setIsWorking(newState);
            await toggleStaffWorking(staffId, storeId, newState);
        } catch (e) {
            // Revert on failure
            setIsWorking(!newState);
            console.error(e);
            alert("변경 실패하였습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault(); // Prevent bubbling if inside a Link
                handleToggle();
            }}
            disabled={isLoading}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900
                ${isWorking ? 'bg-green-500' : 'bg-gray-700'}
            `}
        >
            <span className="sr-only">출근 여부 토글</span>
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${isWorking ? 'translate-x-6' : 'translate-x-1'}
                `}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-black animate-spin opacity-50" />
                </div>
            )}
        </button>
    );
}
