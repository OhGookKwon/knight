'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    loadingText?: string;
}

export default function SubmitButton({ text, loadingText = '저장 중...', className, ...props }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={cn(
                "w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                className
            )}
            {...props}
        >
            {pending && <Loader2 className="animate-spin" size={20} />}
            {pending ? loadingText : text}
        </button>
    );
}
