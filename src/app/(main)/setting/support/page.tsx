"use client";

import Image from "next/image";
import { EXTERNAL_LINKS } from "@/constants/links";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";

export default function SupportPage() {
    const handleOpenForm = () => {
        window.open(EXTERNAL_LINKS.INQUIRY_FORM_URL, "_blank", "noopener,noreferrer");
    };

    return (
        <SettingsDetailLayout
            title="고객센터/문의하기"
            mode="wide"
            className="!items-center !px-0 flex-1"
        >
            <div className="flex flex-col items-center justify-center w-full flex-1 min-h-[500px] text-center gap-8">
                {/* 아이콘/이미지 영역 */}
                <div className="relative w-[120px] h-[120px] bg-Subbrown-4 rounded-full flex items-center justify-center shadow-inner">
                    <Image
                        src="/Setting_Smile_emoji.svg"
                        alt="Customer Support"
                        width={64}
                        height={64}
                        className="opacity-90"
                    />
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-col gap-3">
                    <h1 className="subhead_2 text-Gray-7">소중한 의견을 기다립니다</h1>
                    <p className="body_1_3 text-Gray-4 leading-relaxed">
                        서비스 이용 중 불편한 점이나 제안하고 싶은 내용이 있으신가요? <br className="hidden md:block" />
                        보내주시는 소중한 의견을 바탕으로 더욱 성장하는 체크모가 되겠습니다.
                    </p>
                </div>

                {/* 액션 버튼 영역 */}
                <div className="flex flex-col w-[320px] md:w-[400px] gap-4">
                    <button
                        onClick={handleOpenForm}
                        className="w-full h-[56px] bg-primary-3 text-white rounded-[12px] subhead_4_1 hover:bg-primary-2 transition-colors shadow-md active:scale-[0.98]"
                    >
                        문의하기 폼 열기
                    </button>

                    <div className="flex flex-col gap-2">
                        <p className="body_2_2 text-Gray-3">
                            새 창이 열리지 않았나요?
                        </p>
                        <button
                            onClick={handleOpenForm}
                            className="text-primary-3 body_2_1 underline underline-offset-4 hover:text-primary-2"
                        >
                            직접 링크로 이동하기
                        </button>
                    </div>
                </div>
            </div>
        </SettingsDetailLayout>
    );
}
