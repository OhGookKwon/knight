'use client';

import { useState } from 'react';
import { scrapeGoogleMaps } from '@/app/actions/google-maps';
import { Download, Loader2, MapPin } from 'lucide-react';

export default function GoogleMapsImport() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImport = async () => {
        if (!url) return;
        setIsLoading(true);

        const result = await scrapeGoogleMaps(url);

        if (result.error) {
            alert(result.error);
        } else if (result.success && result.data) {
            const { name, address, image, description } = result.data;

            // 1. Store Name
            const nameInput = document.getElementsByName('name')[0] as HTMLInputElement;
            if (nameInput && name) nameInput.value = name;

            // 2. Address
            const addrInput = document.getElementsByName('address')[0] as HTMLInputElement;
            if (addrInput && address) addrInput.value = address;

            // 3. System Description (Populate with any extra info found in description)
            // Google Maps description often has "★★★★★ (123) · Category · City"
            // We can put this in the notice or system description as reference
            const systemDescInput = document.getElementsByName('systemDescription')[0] as HTMLTextAreaElement;
            if (systemDescInput && description) {
                // Determine if existing value implies we should append or replace
                // Let's just prepend/append reference info
                const current = systemDescInput.value;
                const newInfo = `[구글 맵 정보]\n${description}`;
                systemDescInput.value = current ? current + '\n\n' + newInfo : newInfo;
            }

            // 4. Image
            const mainImageHidden = document.getElementsByName('mainImage')[0] as HTMLInputElement;
            if (mainImageHidden && image) {
                mainImageHidden.value = image;
                const imgPreview = mainImageHidden.parentElement?.querySelector('img');
                if (imgPreview) {
                    imgPreview.src = image;
                }
            }

            alert(`성공! 구글 맵 정보를 가져왔습니다.\n\n가게명: ${name}\n주소: ${address}\n(가격/시스템 정보는 구글 맵에서 제공하지 않아 직접 입력해야 할 수 있습니다)`);
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-4 rounded-xl border border-blue-500/30 mb-8">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-blue-400"><MapPin size={16} /></span> 구글 맵 정보 가져오기
            </h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="flex-1 bg-black/50 border border-blue-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleImport}
                    disabled={isLoading || !url}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
                    가져오기
                </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
                * 구글 맵의 '공유' 버튼을 눌러 링크를 복사해 붙여넣으세요. (가게명, 주소, 메인 이미지를 가져옵니다)
            </p>
        </div>
    );
}
