'use client';

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

interface DeleteButtonProps {
    onDelete: () => Promise<void>;
    entityName: string; // e.g. "Store" or "Staff Member"
    className?: string; // Optional custom styling
}

export default function DeleteButton({ onDelete, entityName, className }: DeleteButtonProps) {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        const confirmed = window.confirm(
            `${entityName}을(를) 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`
        );

        if (confirmed) {
            setIsPending(true);
            try {
                await onDelete();
            } catch (error) {
                console.error("Delete failed", error);
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
                setIsPending(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className={className || "w-full bg-gray-900 hover:bg-red-900/50 text-red-500 font-bold py-3 rounded-xl transition-colors border border-gray-800 flex items-center justify-center gap-2 disabled:opacity-50"}
        >
            <Trash2 size={16} />
            {isPending ? '삭제 중...' : `${entityName} 삭제`}
        </button>
    );
}
