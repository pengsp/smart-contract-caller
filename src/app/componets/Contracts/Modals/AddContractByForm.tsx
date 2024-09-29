"use client"

import { forwardRef, useImperativeHandle, useState, useCallback, useEffect, } from "react";
import { useTranslations } from "next-intl";
import { message, Modal, Radio } from "antd";
import { Contract } from "@/types";
import { isAddress } from "ethers";
import { Button, Form, Input, Select } from "antd";
import { useContractManager } from "@/hooks";
import { networks } from "@/configs";
import classes from "./modals.module.scss"
import { IconChecked, IconUnchecked } from "../../Icons";

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
    const [specifyNetwork, setSpecifyNetwork] = useState(true)
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
            setSpecifyNetwork(chainIds.length > 0)
            setContractHash(hash)
        } else {
            setContractHash(null)
            setSpecifyNetwork(true)
        }
        setIsContractModalOpen(true)
    }

    const handleHideModal = () => {
        setContract(formInitialValues)
        setContractHash(null)
        setIsContractModalOpen(false);
    }
    const handleSpecifyNetwork = (value: boolean) => {
        setSpecifyNetwork(value)
    }
    const onFinish = useCallback((values: any) => {
        const { name, address, abi, remark, chainIds } = values;
        console.log(values)
        if (contractHash) {
            updateContract({
                name,
                address,
                abi: JSON.parse(abi),
                chainIds: specifyNetwork ? chainIds : [],
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
                chainIds: specifyNetwork ? chainIds : [],
                remark
            })
            message.success(t('successfully_added_records', { count: 1 }));
        }
        handleHideModal()
    }, [contractHash, t, specifyNetwork]);


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
            className={classes.form_root}
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
                label={t('base_on')}
            >
                <div>
                    <div className="mb-2 text-gray-400">
                        <div>{t('base_on_tips_1')}</div>
                        <div>{t('base_on_tips_2')}</div>
                    </div>
                    <div className="flex gap-4">
                        <div className={specifyNetwork ? classes.base_on_type_selected : classes.base_on_type} onClick={() => handleSpecifyNetwork(true)}>
                            <div>
                                <div className="text-orange-400 font-bold">{t('specify_network')}</div>
                                <div>{t('specify_network_desc')}</div>
                            </div>
                            <div className={classes.check_icon}>
                                {specifyNetwork ? <IconChecked className="text-blue-400" /> : <IconUnchecked className="text-gray-300" />}
                            </div>
                        </div>
                        <div className={!specifyNetwork ? classes.base_on_type_selected : classes.base_on_type} onClick={() => handleSpecifyNetwork(false)}>
                            <div>
                                <div className="text-orange-400  font-bold">{t('any_network')}</div>
                                <div>{t('unspecified_desc')}</div>
                            </div>
                            <div className={classes.check_icon}>
                                {!specifyNetwork ? <IconChecked className="text-blue-400" /> : <IconUnchecked className="text-gray-300" />}
                            </div>
                        </div>
                    </div>
                    {specifyNetwork
                        ? <Form.Item name="chainIds" noStyle required rules={[{ required: true, message: `${t('specify_network')}${t('is_required')}` }]} >
                            <Select
                                mode="multiple"
                                showSearch
                                allowClear
                                className="!mt-3 w-full"
                                placeholder={t('network_select_placeholder')}
                                options={networks}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) || (option?.nativeCurrency?.symbol ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                optionRender={(option) => (
                                    <div className="flex items-center gap-2">
                                        <span>
                                            {option.data.label}
                                        </span>
                                        <span className="text-gray-300">{option.data.nativeCurrency?.symbol}</span>
                                    </div>
                                )}
                            />
                        </Form.Item>
                        : <div></div>}
                </div>
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
