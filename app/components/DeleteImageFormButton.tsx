'use client';

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteImageFormButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            {pending ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Trash2 size={16} />
            )}
        </button>
    );
}
