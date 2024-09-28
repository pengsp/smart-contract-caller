
import { startTransition } from "react";
import { useLocale } from "next-intl";
import { Button, Popover } from "antd";
import { setUserLocale } from "@/i18n/service";
import classes from "./languageSwitch.module.scss"
import { CheckOutlined } from "@ant-design/icons";
import { langsMap } from "@/i18n/config"
import { IconTranslate } from "../../Icons";

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
        <Popover placement="bottomRight" content={topLangsDom} trigger="click" >
            <div className="cursor-pointer  rounded p-1 px-2 bg-gray-100 hover:bg-gray-200 ">
                <IconTranslate className="stroke-1" />
            </div>
        </Popover>
    </>)
}
