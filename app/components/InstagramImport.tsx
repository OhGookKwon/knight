'use client';

import { useState } from 'react';
import { scrapeInstagram } from '@/app/actions/instagram';
import { Download, Loader2 } from 'lucide-react';

export default function InstagramImport() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImport = async () => {
        if (!url) return;
        setIsLoading(true);

        const result = await scrapeInstagram(url);

        if (result.error) {
            alert(result.error);
        } else if (result.success && result.data) {
            const { name, description, image } = result.data;

            // DOM Manipulation to fill inputs
            // WARNING: This depends on the input names in the form

            const nameInput = document.getElementsByName('name')[0] as HTMLInputElement;
            if (nameInput && name) nameInput.value = name;

            const descInput = document.getElementsByName('description')[0] as HTMLTextAreaElement;
            // Instagram description can be long, maybe put it in 'systemDescription' or 'notice' if description is missing? 
            // The user form has 'description' (which might be 'systemDescription' in schema? Let's check schema/form)
            // Looking at the form code: 
            // <textarea name="systemDescription" ... />
            // <input name="notice" ... />
            // Oh, the schema has `description`? Let me check schema again. 
            // Schema has `description String?`.
            // Form code I saw: `systemDescription` textarea... 
            // Wait, I saw `formData.get('description')` in `updateStore` action, but NOT in the JSX form I read earlier?
            // Let me double check the form field names.
            // In `app/admin/stores/[id]/page.tsx`:
            // name="systemDescription"
            // name="notice"
            // I DO NOT see a name="description" input in the code snippet I read in `ManageStorePage`.
            // But `updateStore` action retrieves `description`. This implies there might be a missing field or I missed it.
            // Let's assume I should populate `systemDescription` or `notice` for now, OR add the `description` field.
            // Actually, description is usually the "Introduciton". `systemDescription` is specific.
            // Let's map Instagram Bio -> `systemDescription` (since it's usually the intro).

            const systemDescInput = document.getElementsByName('systemDescription')[0] as HTMLTextAreaElement;
            if (systemDescInput && description) systemDescInput.value = description;

            // Image is trickier because it's a file input usually, or a hidden input for existing URL?
            // The form has: <input type="hidden" name="mainImage" ... />
            // I can update this hidden input. AND I should show a preview.
            // This requires some UI State manipulation which is hard from outside.
            // BUT, if I update the hidden input, and then submit, it might work IF the user doesn't select a new file.
            // However, the preview <img> won't update automatically unless I hack it too.

            const mainImageHidden = document.getElementsByName('mainImage')[0] as HTMLInputElement;
            if (mainImageHidden && image) {
                mainImageHidden.value = image;
                // Try to find the preview img
                const imgPreview = mainImageHidden.parentElement?.querySelector('img');
                if (imgPreview) {
                    imgPreview.src = image;
                    // Also remove the "opacity-80" or placeholder classes if any?
                } else {
                    // If no image existed, maybe I can't easily show preview without adding an img tag.
                    // It's okay, the hidden input update is key.
                    alert("성공! 내용을 불러왔습니다.\n(이미지는 저장 후 적용됩니다)");
                }
            } else {
                alert("성공! 제목과 내용을 불러왔습니다.");
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 p-4 rounded-xl border border-pink-500/30 mb-8">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-pink-400">📸</span> 인스타그램 정보 가져오기
            </h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.instagram.com/account_name"
                    className="flex-1 bg-black/50 border border-pink-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
                <button
                    onClick={handleImport}
                    disabled={isLoading || !url}
                    className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
                    가져오기
                </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
                * 공개된 계정의 프로필 정보(제목, 소개, 메인사진)만 가져올 수 있습니다.
            </p>
        </div>
    );
}
