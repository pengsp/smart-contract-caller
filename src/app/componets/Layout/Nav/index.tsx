
"use client"
import Image from "next/image"
import { useTranslations } from 'next-intl';
import { GithubOutlined } from "@ant-design/icons";
import Connection from "../../Connection";
import LanguageSwitch from "../LanguageSwitch";
export default function Nav() {
    const t = useTranslations();

    return (
        <div className=" sticky top-0 left-0 right-0 px-6 py-[18px]  border-b bg-white z-10 h-[100px]">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div>
                        <Image src="/images/logo.png" width={60} height={60} alt="Smart contract tools" />
                    </div>
                    <div className="flex flex-col justify-around">
                        <div className="text-2xl">{t('project_name')}</div>
                        <p className="text-gray-400 ">{t('slogan')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Connection />
                    <LanguageSwitch />

                    <a href="https://github.com/pengsp/smart-contract-caller" target="_blank" title="Github">
                        <GithubOutlined className="text-2xl hover:scale-105 " />
                    </a>
                </div>
            </div>
        </div>
    )
}