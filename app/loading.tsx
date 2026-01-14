import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            <p className="text-gray-400 text-sm animate-pulse">잠시만 기다려주세요...</p>
        </div>
    );
}
