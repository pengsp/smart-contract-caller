"use client"

import { forwardRef, useImperativeHandle, useState, useCallback, useEffect, } from "react";
import { useTranslations } from "next-intl";
import { message, Modal } from "antd";
import { Contract } from "@/types";
import { isAddress } from "ethers";
import { Button, Form, Input, Select } from "antd";
import { useContractManager } from "@/hooks";
import networks from "@/configs/chains.json";

const formInitialValues = {
    name: '',
    address: '',
    abi: "",
    chainIds: [],
    remark: ''
}

const AddContractByForm = forwardRef(function AddContractByForm(props, ref) {
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [contractHash, setContractHash] = useState<string | undefined | null>()
    const { updateContract, addContract } = useContractManager()
    const [contract, setContract] = useState<Record<string, any>>(formInitialValues)
    const t = useTranslations();

    useImperativeHandle(ref, () => {
        return {
            show: (contract?: Contract) => init(contract)
        }
    }, [])

    const init = (contract?: Contract) => {
        if (contract) {
            const { name, address, abi: abiJSON, chainIds, remark, hash } = contract
            const abi = JSON.stringify(abiJSON)
            setContract({ name, address, abi, chainIds, remark })
            setContractHash(hash)
        } else {
            setContractHash(null)
        }
        setIsContractModalOpen(true)
    }

    const handleHideModal = () => {
        setContract(formInitialValues)
        setContractHash(null)
        setIsContractModalOpen(false);
    }

    const onFinish = useCallback((values: any) => {
        const { name, address, abi, remark, chainIds } = values;
        if (contractHash) {
            updateContract({
                name,
                address,
                abi: JSON.parse(abi),
                chainIds,
                remark,
                hash: contractHash,
                timestamp: new Date().getTime()
            })
            message.success(t('update_success'));
        } else {
            addContract({
                name,
                address,
                abi: JSON.parse(abi),
                chainIds,
                remark
            })
            message.success(t('successfully_added_records', { count: 1 }));
        }
        handleHideModal()
    }, [contractHash, t]);


    return (<Modal title={t('add_contract')}
        open={isContractModalOpen}
        onCancel={handleHideModal}
        footer={null}
        maskClosable={false}
        width={800}
        zIndex={102}
        destroyOnClose
    >
        <Form
            name="contractForm"
            autoComplete="off"
            layout="vertical"
            initialValues={contract}
            onFinish={onFinish}
        >
            <Form.Item
                label={t('contract_name')}
                name="name"
                validateTrigger="onBlur"
                rules={[{ required: true, message: `${t('contract_name')}${t('is_required')}` }]}
            >
                <Input placeholder={t('contract_name')} allowClear maxLength={50} showCount />
            </Form.Item>

            <Form.Item
                label={t('contract_address')}
                name="address"
                required
                validateTrigger="onBlur"
                rules={[{
                    validator: (_, value) => {
                        if (!value) {
                            return Promise.reject(new Error(`${t('contract_address')}${t('is_required')}`))
                        }
                        return isAddress(value) ? Promise.resolve() : Promise.reject(new Error(`${t('invalid')}${t('contract_address')}`))
                    }
                }]}
            >
                <Input placeholder={t('contract_address')} allowClear />
            </Form.Item>


            <Form.Item
                label={t('base_on')}
            >
                <div>
                    <div className="mb-3 text-orange-400">
                        <div>{t('base_on_tips')}</div>
                    </div>

                    <Form.Item name="chainIds" noStyle>
                        <Select
                            mode="multiple"
                            showSearch
                            allowClear
                            style={{ width: '100%' }}
                            placeholder={t('network_select_placeholder')}
                            options={networks}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) || (option?.nativeCurrency?.name ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            optionRender={(option) => (
                                <div className="flex items-center gap-2">
                                    <span>
                                        {option.data.label}
                                    </span>
                                    <span className="text-gray-300">{option.data.nativeCurrency?.name}</span>
                                </div>
                            )}
                        />
                    </Form.Item>
                </div>
            </Form.Item>
            <Form.Item
                label="ABI"
                name="abi"
                required
                validateTrigger="onBlur"
                rules={[{
                    validator: (_, value) => {
                        if (!value) {
                            return Promise.reject(new Error(`ABI${t('is_required')}`))
                        }
                        try {
                            const abiJson = JSON.parse(value)
                            if (abiJson instanceof Array) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject(new Error(t('incorrect_format')))
                            }
                        } catch (e) {
                            return Promise.reject(new Error(t('incorrect_format')))
                        }
                    }
                }]}
            >
                <Input.TextArea rows={8} placeholder={t('abi_placeholder')} allowClear />
            </Form.Item>
            <Form.Item
                label={t('remark')}
                name="remark"
            >
                <Input.TextArea rows={2} autoSize={{ minRows: 2, maxRows: 4 }} placeholder={t('remark')} allowClear maxLength={200} showCount />
            </Form.Item>
            <div className="flex gap-5 justify-end">
                <Button onClick={handleHideModal}>{t('cancel')}</Button>

                <Button type="primary" htmlType="submit" >
                    {t('submit')}
                </Button>
            </div>
        </Form>
    </Modal>)
})
export default AddContractByForm;
