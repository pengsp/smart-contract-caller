
"use client"
import { useTranslations } from "next-intl";
import { Button, Dropdown } from "antd";
import { BlockOutlined, CloudUploadOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { ViaType } from "@/types";
import type { MenuProps } from 'antd';

export default function AddContractBtn({ action }: { action: (via: ViaType) => void }) {
    const t = useTranslations();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        const via = e.key as ViaType
        action(via)
    };

    const items: MenuProps['items'] = [{
        key: '1',
        type: 'group',
        label: t('select_via'),
        children: [{
            label: t('form_submission'),
            key: 'form',
            icon: <FileTextOutlined />,
        },
        {
            label: t('upload_json'),
            key: 'upload',
            icon: <CloudUploadOutlined />,
        },
        {
            label: t('paste_json'),
            key: 'paste',
            icon: <BlockOutlined />,
        },]
    }

    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (<>
        <Dropdown menu={menuProps} placement="bottomRight" arrow>
            <Button icon={<PlusOutlined />} type="primary"> {t('add_contract')}</Button>
        </Dropdown>
    </>)
}