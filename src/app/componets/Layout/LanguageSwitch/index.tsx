
import { startTransition } from "react";
import { useLocale } from "next-intl";
import { Popover } from "antd";
import { setUserLocale } from "@/i18n/service";
import classes from "./languageSwitch.module.scss"
import { CheckOutlined } from "@ant-design/icons";
import { langsMap } from "@/i18n/config"
import { IconChinaFlag, IconUSFlag } from "../../Icons";

export default function LanguageSwitch() {

    const lang = useLocale();

    const topLangsDom = Object.keys(langsMap).map((key: string) => {
        return <div className={key == lang ? classes.lang_current : classes.lang} onClick={() => switchLang(key)} key={key}>
            {langsMap[key]}
            {key == lang && <CheckOutlined />}
        </div>
    })

    const switchLang = (lang: string) => {
        startTransition(() => {
            setUserLocale(lang);
        });
    }
    return (<>
        <Popover placement="bottomRight" content={topLangsDom}  >
            <div className="cursor-pointer">
                {lang == 'zh-CN' ? <IconChinaFlag /> : <IconUSFlag />}
            </div>
        </Popover>
    </>)
}