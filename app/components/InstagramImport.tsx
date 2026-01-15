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
            const nameInput = document.getElementsByName('name')[0] as HTMLInputElement;
            if (nameInput && name) {
                // Remove emoji/special chars from name if it seems excessive? 
                // Keep it simple for now, user can edit.
                nameInput.value = name;
            }

            // Intelligent Bio Parsing
            let bio = description || '';
            const lines = bio.split(/\r?\n|\r/); // Split strictly by newline to preserve structure

            let foundAddress = '';
            let foundHours = '';
            let foundCharge = [];
            let foundSystem = []; // Additional system info
            let remainingBio = [];

            for (const line of lines) {
                const l = line.trim();
                if (!l) continue;

                // Address Detection (more robust)
                if (l.match(/(東京都|新宿区|Kabukicho|Shin-Okubo|区|〒|[0-9]{3}-[0-9]{4}|ビル|F$|階$)/i)) {
                    // Check if it looks like an address line
                    if (!foundAddress) foundAddress = l;
                    else foundAddress += ' ' + l;
                }
                // Opening Hours Detection
                else if (l.match(/(OPEN|CLOSE|営業|Time|~|～|:|PM|AM|Last|L\.O|24H)/i) && l.match(/\d/)) {
                    if (!foundHours) foundHours = l;
                    else foundHours += ' / ' + l;
                }
                // Charge/System Detection (Prices, Sets, Taxes)
                else if (l.match(/(Charge|SET|System|Price|料金|￥|¥|円|엔|won|Tax|SC|サービス|飲み放題|Set|Time|Hour|Extension|延長)/i)) {
                    foundCharge.push(l);
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
            if (chargeInput && foundCharge.length > 0) {
                // Try to find the line with "Set" or "Basic" or just the first price line
                const basicLine = foundCharge.find(l => l.match(/(Set|Basic|Charge|1H|60min)/i)) || foundCharge[0];
                chargeInput.value = basicLine;
            }

            const systemDescInput = document.getElementsByName('systemDescription')[0] as HTMLTextAreaElement;
            if (systemDescInput) {
                // Combine Charge info + System info for full description
                // We put ALL found charge lines into system description for detail
                const fullDesc = [
                    ...foundCharge,
                    '',
                    ...remainingBio
                ].join('\n').trim();

                systemDescInput.value = fullDesc || bio;
            }

            // Store Name Guessing from Bio (if Name input is empty or looks generic)
            // Sometimes bio starts with "【Store Name】"
            const nameMatch = bio.match(/^【(.*?)】/);
            if (nameMatch && nameInput && (!nameInput.value || nameInput.value === 'Instagram')) {
                nameInput.value = nameMatch[1];
            }

            // Image Handler
            const mainImageHidden = document.getElementsByName('mainImage')[0] as HTMLInputElement;
            if (mainImageHidden && image) {
                mainImageHidden.value = image;
                const imgPreview = mainImageHidden.parentElement?.querySelector('img');
                if (imgPreview) {
                    imgPreview.src = image;
                }
            }

            alert(`성공! 정보를 가져왔습니다.\n\n[자동 입력 결과]\n체크된 항목이 입력되었습니다:\n\n가게명: ${name} ${nameMatch ? '(Bio에서 발견)' : ''}\n주소: ${foundAddress ? '✅' : '❌'}\n영업시간: ${foundHours ? '✅' : '❌'}\n시스템/가격: ${foundCharge.length > 0 ? '✅' : '❌'}`);
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
