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

            // Intelligent Bio Parsing
            let bio = description || '';
            const lines = bio.split(/\r?\n|\r|\s{2,}/); // Split by newline or multiple spaces

            let foundAddress = '';
            let foundHours = '';
            let foundCharge = '';
            let remainingBio = [];

            for (const line of lines) {
                const l = line.trim();
                if (!l) continue;

                // Address Detection
                if (l.match(/(東京都|新宿区|Kabukicho|Shin-Okubo|区|〒)/i)) {
                    if (!foundAddress) foundAddress = l;
                    else foundAddress += ' ' + l; // Append if multiple address lines
                }
                // Opening Hours Detection
                else if (l.match(/(OPEN|CLOSE|営業|Time|~|～|:)/i) && l.match(/\d/)) {
                    // Check for time-like digits to avoid false positives
                    if (!foundHours) foundHours = l;
                    else foundHours += ' / ' + l;
                }
                // System/Charge Detection
                else if (l.match(/(Charge|SET|System|Price|料金|￥|¥|엔)/i)) {
                    if (!foundCharge) foundCharge = l;
                    else foundCharge += '\n' + l;
                }
                else {
                    remainingBio.push(l);
                }
            }

            // Fill Fields
            const addrInput = document.getElementsByName('address')[0] as HTMLInputElement;
            if (addrInput && foundAddress) addrInput.value = foundAddress;

            const hoursInput = document.getElementsByName('openingHours')[0] as HTMLInputElement;
            if (hoursInput && foundHours) hoursInput.value = foundHours;

            const chargeInput = document.getElementsByName('basicCharge')[0] as HTMLInputElement;
            if (chargeInput && foundCharge) chargeInput.value = foundCharge.split('\n')[0]; // Take first line for basic charge

            // Put full bio in system description (or just remaining?)
            // Usually user wants full context + extracted fields
            const systemDescInput = document.getElementsByName('systemDescription')[0] as HTMLTextAreaElement;
            if (systemDescInput) {
                // Combine Charge info + Remaining Bio for full description
                const fullDesc = (foundCharge ? foundCharge + '\n\n' : '') + remainingBio.join('\n');
                systemDescInput.value = fullDesc || bio;
            }

            // Image Handler
            const mainImageHidden = document.getElementsByName('mainImage')[0] as HTMLInputElement;
            if (mainImageHidden && image) {
                mainImageHidden.value = image;
                const imgPreview = mainImageHidden.parentElement?.querySelector('img');
                if (imgPreview) {
                    imgPreview.src = image;
                }
                // Try to find the container div to remove placeholder styling if needed? 
                // Currently generic <img> tag is OK.
            }

            alert(`성공! 내용을 불러왔습니다.\n\n[추출된 정보]\n가게명: ${name}\n주소: ${foundAddress ? 'O' : 'X'}\n영업시간: ${foundHours ? 'O' : 'X'}\n가격정보: ${foundCharge ? 'O' : 'X'}`);
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
