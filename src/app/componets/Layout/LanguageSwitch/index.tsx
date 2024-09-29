
import { startTransition, useState } from "react";
import { useLocale } from "next-intl";
import { Button, Popover } from "antd";
import { setUserLocale } from "@/i18n/service";
import classes from "./languageSwitch.module.scss"
import { CheckOutlined } from "@ant-design/icons";
import { langsMap } from "@/i18n/config"
import { IconTranslate } from "../../Icons";

export default function LanguageSwitch() {
    const [open, setOpen] = useState(false);

    const lang = useLocale();

    const topLangsDom = Object.keys(langsMap).map((key: string) => {
        return <div className={key == lang ? classes.lang_current : classes.lang} onClick={() => switchLang(key)} key={key}>
            {langsMap[key]}
            {key == lang && <CheckOutlined />}
        </div>
    })

    const switchLang = (lang: string) => {
        startTransition(() => {
            setOpen(false);
            setUserLocale(lang);
        });
    }
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    return (<>
        <Popover placement="bottomRight" content={topLangsDom} trigger="click" open={open} onOpenChange={handleOpenChange}>
            <div className="cursor-pointer  rounded p-1 px-2  ">
                <IconTranslate className="stroke-1" />
            </div>
        </Popover>
    </>)
}
