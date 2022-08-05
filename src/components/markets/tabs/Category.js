import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import SearchInput from 'src/components/markets/SearchInput';

import { IconClose, IconLoading } from 'src/components/common/Icons';
import { Dialog, Transition } from '@headlessui/react';
import { useAsync } from 'react-use';
import {
    createCategory,
    getCategoryAvatarList,
    getCategoryList,
    setUserSymbolList,
    updateCategory,
} from 'src/redux/actions/market';
import { getLoginUrl, getS3Url } from 'src/redux/actions/utils';
import Disclosure from 'src/components/markets/Disclosure';
import { useSelector } from 'react-redux';
import TableNoData from 'src/components/common/table.old/TableNoData';
import TableLoader from 'src/components/loader/TableLoader';
import AssetLogo from 'src/components/wallet/AssetLogo';
import { debounce } from 'lodash';
import ToggleAsset from '../ToggleAsset';

const Category = ({ symbolList, quoteAsset, renderPriceData, renderPercentageChange, multiValue }) => {
    const [avatarList, setAvatarList] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [isDefaultCategory, setIsDefaultCategory] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [errorCategoryName, setErrorCategoryName] = useState(false);
    const [errorAvatar, setErrorAvatar] = useState(false);
    const [filteredCategoryList, setFilteredCategoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState('create_category');
    const [selectedName, setSelectedName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedAssets, setSelectedAssets] = useState('');
    const [filteredAssetList, setFilteredAssetList] = useState([]);
    const [activeAssetList, setActiveAssetList] = useState([]);
    const [baseAssetList, setBaseAssetList] = useState([]);
    const [isLoadingAPI, setIsLoadingAPI] = useState(false);

    const user = useSelector(state => state.auth.user) || null;

    const assetConfigList = useSelector(state => state?.utils?.assetConfig ?? []);
    const exchangeConfigList = useSelector(state => state?.utils?.exchangeConfig ?? []);

    useEffect(() => {
        const list = [];
        exchangeConfigList.forEach(
            exchange => {
                list.push(...assetConfigList.filter(
                    asset => {
                        return (asset.assetCode === exchange.baseAsset) && (exchange.quoteAsset === quoteAsset);
                    },
                ));
            },
        );
        setFilteredAssetList(list);
        setBaseAssetList(list);
    }, []);

    useEffect(() => {
        setActiveAssetList(categoryList.filter(category => category.id === selectedCategoryId)?.[0]?.assets);
    }, [selectedCategoryId, categoryList]);

    const customStyle = {
        paddingLeft: 16,
        paddingRight: 20,
    };

    const customFilterWrapperStyle = {
        border: 'none',
        margin: 0,
        width: 240,
    };

    const customAssetsStyle = {
        padding: '8px 16px',
        backgroundColor: '#F8F7FA',
        border: 'none',
    };

    const customAssetsWrapperStyle = {
        border: 'none',
        backgroundColor: '#F8F7FA',
        margin: 0,
    };

    useAsync(async () => {
        // Get symbol list
        if (user) {
            const avaList = await getCategoryAvatarList();
            if (avaList && avaList.length > 0) {
                setAvatarList(avaList);
            }
            const category = await getCategoryList();
            if (category && category.length > 0) {
                const filteredList = category.filter(cat => cat.type === 'USER');
                setFilteredCategoryList(filteredList);
                return setCategoryList(filteredList);
            }
            return null;
        }
    }, [toggleModal]);

    const handleReloadCategoryList = async () => {
        const category = await getCategoryList();
        if (category && category.length > 0) {
            const filteredList = category.filter(cat => cat.type === 'USER');
            setFilteredCategoryList(filteredList);
            setCategoryList(filteredList);
        }
    };

    useAsync(async () => {
        if (user) {
            handleReloadCategoryList();
        }
        return setLoading(false);
    }, [loading]);

    const { t } = useTranslation(['markets', 'common']);

    const handleToggleModal = ({ isClose, type, itemName, itemAvatar, id, assets, isDefault }) => () => {
        if (typeof isDefault === 'boolean') {
            setIsDefaultCategory(isDefault);
        }
        if (id) {
            setSelectedCategoryId(id);
        }
        if (itemName) {
            setSelectedName(itemName);
        }
        if (itemAvatar) {
            setSelectedAvatar(itemAvatar);
        } else {
            setSelectedAvatar('');
        }
        if (type) {
            setModalType(type);
        }
        if (assets) {
            setSelectedAssets(assets);
        }
        if (typeof isClose === 'boolean') {
            return setToggleModal(false);
        }
        return setToggleModal(!toggleModal);
    };

    const handleCategoryName = (e) => {
        const { value } = e.target;
        if (errorCategoryName) {
            setErrorCategoryName(false);
        }
        if (selectedName && selectedName.length > 0) {
            setSelectedName('');
        }
        setCategoryName(value);
    };

    const handleSelectAvatar = (avatar) => () => {
        if (errorAvatar) {
            setErrorAvatar(false);
        }
        setSelectedAvatar(avatar);
    };

    const renderAvatarList = () => {
        return avatarList.map((avatar) => {
            return (
                <div
                    key={avatar}
                    className={`mr-3 py-0 my-0 box-border rounded-lg cursor-pointer ${selectedAvatar === avatar && 'ring-1 ring-[#00C8BC]'}`}
                    onClick={handleSelectAvatar(avatar)}
                >
                    <img
                        src={getS3Url(avatar)}
                        alt="avatar"
                        width={52}
                        height={52}
                        className="rounded-lg"
                    />
                </div>
            );
        },
        );
    };

    const handleDefaultCategory = () => {
        setIsDefaultCategory(!isDefaultCategory);
    };

    const resetStates = () => {
        setCategoryName('');
        setSelectedAvatar('');
        setErrorCategoryName(false);
        setErrorAvatar(false);
        setIsDefaultCategory(false);
    };

    const handleSubmit = useCallback(
        debounce(async () => {
            await setIsLoadingAPI(true);
            const formattedCategoryName = categoryName.trim();
            const formattedSelectedAvatar = selectedAvatar.trim();
            const finalData = {
                'name': formattedCategoryName,
                'assets': [],
                'avatar': formattedSelectedAvatar,
                'isDefault': isDefaultCategory,
            };

            if (formattedCategoryName.length < 1) {
                setIsLoadingAPI(false);
                return setErrorCategoryName(true);
            }

            if (formattedSelectedAvatar.length < 1) {
                setIsLoadingAPI(false);
                return setErrorAvatar(true);
            }

            await createCategory(finalData);
            await handleReloadCategoryList();
            resetStates();
            setIsLoadingAPI(false);
            return setToggleModal(false);
        }, 800), [categoryName, selectedAvatar, isDefaultCategory, isLoadingAPI]);

    const handleEdit = useCallback(debounce(async () => {
        await setIsLoadingAPI(true);
        const formattedCategoryName = selectedName.trim().length > 0 ? selectedName.trim() : categoryName.trim();
        const formattedSelectedAvatar = selectedAvatar.trim();

        const finalData = {
            'id': selectedCategoryId,
            'name': formattedCategoryName,
            'assets': selectedAssets,
            'avatar': formattedSelectedAvatar,
            'isDefault': isDefaultCategory,
        };

        if (formattedCategoryName.length < 1) {
            setIsLoadingAPI(false);
            return setErrorCategoryName(true);
        }

        if (formattedSelectedAvatar.length < 1) {
            setIsLoadingAPI(false);
            return setErrorAvatar(true);
        }

        await updateCategory(finalData);
        await handleReloadCategoryList();
        resetStates();
        setIsLoadingAPI(false);
        return setToggleModal(false);
    }, 800), [categoryName, selectedAvatar, isDefaultCategory, isLoadingAPI]);

    const handleFilterCategoryList = (value) => {
        let filtered = [];
        if (value.length === 0) {
            filtered = [...categoryList];
        } else {
            filtered = categoryList.filter(category => category.name.toLowerCase().includes(value.toLowerCase()));
        }
        setFilteredCategoryList(filtered);
    };

    const handleFilterAssetsList = (value) => {
        let filtered = [];
        if (value.length === 0) {
            filtered = [...baseAssetList];
        } else {
            filtered = baseAssetList.filter(asset => asset.assetCode.toLowerCase().includes(value.toLowerCase()));
        }
        setFilteredAssetList(filtered);
    };

    const checkExistAsset = (list, asset) => {
        if (list.filter(as => as === asset).length > 0) return true;
        return false;
    };

    const updateAssets = useCallback(debounce(async (list) => {
        await setIsLoadingAPI(true);
        await setUserSymbolList(selectedCategoryId, list);
        handleReloadCategoryList();
        setIsLoadingAPI(false);
        return setToggleModal(false);
    }, 600), [selectedCategoryId, categoryList, isLoadingAPI]);

    const handleAddNewAssets = (asset) => {
        let finalAssets = [];
        if (checkExistAsset(activeAssetList, asset)) {
            finalAssets = activeAssetList.filter(as => as !== asset);
        } else finalAssets = [...activeAssetList, asset];
        return setActiveAssetList(finalAssets);
    };

    const renderCategoryList = useCallback(() => {
        const filterSymbols = () => {
            let assetsList = [];
            const filteredAssetsList = [];
            categoryList.forEach(item => {
                assetsList = [...assetsList, ...item.assets];
                return assetsList;
            });
            assetsList = [...new Set(assetsList)];

            if (symbolList && symbolList.length > 0) {
                assetsList.forEach(asset => {
                    filteredAssetsList.push(...symbolList.filter(symbol => {
                        return ((typeof symbol.b === 'string' ? symbol.b.toLowerCase() : JSON.stringify(symbol.b).toLowerCase()) === asset.toLowerCase());
                    }));
                });
                return filteredAssetsList;
            }
            return [];
        };
        const filteredList = filterSymbols();
        const sortedCategoryList = filteredCategoryList.sort((a, b) => b.isDefault - a.isDefault);
        if (sortedCategoryList.length === 0) {
            return (
                <TableNoData />
            );
        }
        return (
            <div className="mt-6">
                {sortedCategoryList.map((category, index) => {
                    let data = [];
                    category.assets.forEach(asset => {
                        data = [...data, ...filteredList.filter(item => (item.b === asset) && (item.q === quoteAsset))];
                        return data;
                    });
                    return (
                        <Disclosure
                            itemName={category.name}
                            itemAvatar={category.avatar}
                            badge={category.isDefault}
                            data={data}
                            actions
                            key={category.id}
                            id={category.id}
                            handleReloadCategoryList={handleReloadCategoryList}
                            handleToggleModal={handleToggleModal}
                            isDefault={category.isDefault}
                            renderPriceData={renderPriceData}
                            renderPercentageChange={renderPercentageChange}
                            multiValue={multiValue}
                        />
                    );
                })}
            </div>
        );
    }, [categoryList, filteredCategoryList, quoteAsset, symbolList, handleReloadCategoryList]);

    const renderModalContent = () => {
        switch (modalType) {
            case 'create_category': {
                return (
                    <>
                        <Dialog.Title
                            as="h3"
                            className="text-xl font-semibold leading-6 flex flex-row items-center justify-between"
                        >
                            <p>{t('create_category_title')}</p>
                            <div onClick={handleToggleModal({ isClose: true })} className="cursor-pointer">
                                <IconClose />
                            </div>
                        </Dialog.Title>
                        <div className="mt-6">
                            <div className="w-full">
                                <p className="text-xs mb-2 font-normal">{t('create_category_label')}</p>
                                <input
                                    type="text"
                                    className={`w-full focus:outline-none border ${errorCategoryName ? 'border-red' : 'border-gray-400'} rounded px-4 py-3 text-sm`}
                                    placeholder={t('category_name_placeholder')}
                                    onChange={handleCategoryName}
                                    value={categoryName}
                                />
                                {errorCategoryName &&
                                <p className="text-xxs text-red mt-1">{t('category_name_warn')}</p>}
                            </div>
                            <div className="mt-5 w-full">
                                <p className="text-xs mb-2 font-normal">{t('create_category_avatar')}</p>
                                <div className="flex flex-row items-center">
                                    {renderAvatarList()}
                                </div>
                                {errorAvatar &&
                                <p className="text-xxs text-red mt-1">{t('category_avatar_warn')}</p>}
                            </div>
                        </div>

                        <div className="flex flex-row items-center my-6">
                            <input
                                type="checkbox"
                                name="isDefaultAvatar"
                                id="isDefaultAvatar"
                                className="cursor-pointer"
                                onChange={handleDefaultCategory}
                                checked={isDefaultCategory}
                            />
                            <label
                                htmlFor="isDefaultAvatar"
                                className="text-xs ml-2 font-normal cursor-pointer"
                            >
                                {t('create_category_default')}
                            </label>
                        </div>

                        <button
                            type="button"
                            className={`btn-primary px-9 py-[11px] rounded-md text-white font-semibold text-sm w-full flex items-center justify-center ${isLoadingAPI ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={handleSubmit}
                            disabled={isLoadingAPI}
                        >
                            { isLoadingAPI && <span className="mr-2"><IconLoading color="#FFFFFF" /></span>} {t('create_category_confirm')}
                        </button>
                    </>
                );
            }
            case 'edit_category': {
                return (
                    <>
                        <Dialog.Title
                            as="h3"
                            className="text-xl font-semibold leading-6 flex flex-row items-center justify-between"
                        >
                            <p>{t('edit_category_title')}</p>
                            <div onClick={handleToggleModal({ isClose: true })} className="cursor-pointer">
                                <IconClose />
                            </div>
                        </Dialog.Title>
                        <div className="mt-6">
                            <div className="w-full">
                                <p className="text-xs mb-2 font-normal">{t('create_category_label')}</p>
                                <input
                                    type="text"
                                    className={`w-full focus:outline-none border ${errorCategoryName ? 'border-red' : 'border-gray-400'} rounded px-4 py-3 text-sm`}
                                    placeholder={t('category_name_placeholder')}
                                    onChange={handleCategoryName}
                                    value={categoryName.length > 0 ? categoryName : selectedName}
                                />
                                {errorCategoryName &&
                                <p className="text-xxs text-red mt-1">{t('category_name_warn')}</p>}
                            </div>
                            <div className="mt-5 w-full">
                                <p className="text-xs mb-2 font-normal">{t('create_category_avatar')}</p>
                                <div className="flex flex-row items-center">
                                    {renderAvatarList()}
                                </div>
                                {errorAvatar &&
                                <p className="text-xxs text-red mt-1">{t('category_avatar_warn')}</p>}
                            </div>
                        </div>
                        <div className="flex flex-row items-center my-6">
                            <input
                                type="checkbox"
                                name="isDefaultAvatar"
                                id="isDefaultAvatar"
                                className="cursor-pointer"
                                onChange={handleDefaultCategory}
                                checked={isDefaultCategory}
                            />
                            <label
                                htmlFor="isDefaultAvatar"
                                className="text-xs ml-2 font-normal cursor-pointer"
                            >
                                {t('create_category_default')}
                            </label>
                        </div>

                        <button
                            type="button"
                            className={`btn-primary px-9 py-[11px] rounded-md text-white font-semibold text-sm w-full flex items-center justify-center ${isLoadingAPI ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={handleEdit}
                            disabled={isLoadingAPI}
                        >{ isLoadingAPI && <span className="mr-2"><IconLoading color="#FFFFFF" /></span>} {t('create_category_confirm')}
                        </button>
                    </>
                );
            }
            case 'add_assets': {
                if (activeAssetList) {
                    return (
                        <div>
                            <Dialog.Title
                                as="h3"
                                className="text-xl font-semibold leading-6 flex flex-row items-center justify-between"
                            >
                                <p>{t('add_category_assets_title')}
                                    <span className="font-normal text-base ml-2">
                                        {selectedName}
                                    </span>
                                </p>
                                <div onClick={handleToggleModal({ isClose: true })} className="cursor-pointer">
                                    <IconClose />
                                </div>
                            </Dialog.Title>
                            <div className="mt-6">
                                <SearchInput
                                    placeholder={t('create_category_placeholder')}
                                    customStyle={customAssetsStyle}
                                    customWrapperStyle={customAssetsWrapperStyle}
                                    handleFilterAssetsList={handleFilterAssetsList}
                                />
                                <div className="max-h-[450px] overflow-y-auto pr-6 -mr-6 mt-5">
                                    {filteredAssetList.sort((a, b) => a.assetCode.localeCompare(b.assetCode)).map(asset => (
                                        <div
                                            className="flex flex-row items-center justify-between mb-5"
                                            key={asset.assetCode}
                                        >
                                            <div className="flex flex-row items-center">
                                                <AssetLogo assetCode={asset?.assetCode} assetId={asset?.id} />
                                                <div className="flex flex-col ml-3">
                                                    <p className="text-txtPrimary font-semibold text-sm">{asset?.assetCode}</p>
                                                    <p className="text-txtSecondary text-xs">{asset?.assetName}</p>
                                                </div>
                                            </div>
                                            <ToggleAsset
                                                assetName={asset?.assetCode}
                                                isActive={activeAssetList.some(as => as.toLowerCase() === asset?.assetCode.toLowerCase())}
                                                handleAddNewAssets={handleAddNewAssets}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className={`btn-primary mt-5 px-9 py-[11px] rounded-md text-white font-semibold text-sm w-full flex items-center justify-center ${isLoadingAPI ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={() => updateAssets(activeAssetList)}
                                    disabled={isLoadingAPI}
                                >
                                    { isLoadingAPI && <span className="mr-2"><IconLoading color="#FFFFFF" /></span>} {t('confirm')}
                                </button>
                            </div>
                        </div>
                    );
                }
                return null;
            }
            default:
                return null;
        }
    };

    const renderModal = () => {
        return (
            <Transition
                appear
                show={toggleModal}
                as={Fragment}
                enter="transition-opacity duration-250"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={handleToggleModal({ type: 'create_category' })}
                    open={toggleModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-250"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black-800 opacity-60" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-250"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                className="inline-block w-full max-w-md max-h-[680px] p-6 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                            >
                                {renderModalContent()}
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    if (loading) return <TableLoader />;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center">
                <TableNoData />
                <a href={getLoginUrl('sso')} className="btn button-common block text-center">
                    {t('common:sign_in_to_continue')}
                </a>
                {renderModal()}
            </div>
        );
    }

    if (categoryList.length > 0) {
        return (
            <>
                <div className="flex flex-row items-center justify-between">
                    <SearchInput
                        placeholder={t('create_category_placeholder')}
                        customStyle={customStyle}
                        handleFilterCategoryList={handleFilterCategoryList}
                        customWrapperStyle={customFilterWrapperStyle}
                    />

                    <button
                        type="button"
                        className="btn-primary px-6 py-2 rounded-md text-white font-semibold text-sm"
                        onClick={handleToggleModal({ type: 'create_category' })}
                    >{t('create_category')}
                    </button>
                    {renderModal()}
                </div>
                {renderCategoryList()}
            </>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <TableNoData />
            <button
                type="button"
                className="btn-primary px-9 py-[11px] rounded-md text-white font-semibold text-sm"
                onClick={handleToggleModal({ type: 'create_category' })}
            >{t('create_category')}
            </button>
            {renderModal()}
        </div>
    );
};

export default React.memo(Category);
