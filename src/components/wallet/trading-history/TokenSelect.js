import React, { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import SearchInput from 'src/components/markets/SearchInput';
import AssetLogo from '../AssetLogo';

const TokenSelect = ({ baseAssetList, data, onChange, initValue }) => {
    const { t } = useTranslation(['trading-history', 'common']);

    const [selectedAsset, setSelectedAsset] = useState({});
    const [filteredAssetList, setFilteredAssetList] = useState([]);

    // useEffect(() => {
    //     if (baseAssetList && baseAssetList.length > 0) {
    //         setAssetList(baseAssetList);
    //     }
    // }, [baseAssetList]);

    const handleSelectAsset = (asset) => {
        setSelectedAsset(asset);
        onChange(asset);
    };

    const customStyle = {
        paddingLeft: 16,
        paddingRight: 20,
    };

    const customFilterWrapperStyle = {
        border: 'none',
        margin: 0,
        padding: '1.5rem 2rem 1rem',
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

    const renderOptions = () => {
        if (filteredAssetList && filteredAssetList.length > 0) {
            return filteredAssetList.sort((a, b) => a?.assetCode.localeCompare(b.assetCode)).map((asset, index) => (
                <React.Fragment key={index}>
                    <Listbox.Option
                        value={asset}
                        className="focus:outline-none text-[#02083D] text-sm px-4 py-[10px] hover:bg-[#00C8BC] hover:text-white rounded flex flex-row items-center"
                    >
                        <AssetLogo assetCode={asset?.assetCode} assetId={asset?.id} /> <span className="ml-2">{asset.assetCode}</span>
                    </Listbox.Option>
                </React.Fragment>
            ));
        }
        if (baseAssetList && baseAssetList.length > 0) {
            return baseAssetList.sort((a, b) => a?.assetCode.localeCompare(b.assetCode)).map((asset, index) => (
                <React.Fragment key={index}>
                    <Listbox.Option
                        value={asset}
                        className="focus:outline-none text-[#02083D] text-sm px-4 py-[10px] hover:bg-[#00C8BC] hover:text-white rounded flex flex-row items-center"
                    >
                        <AssetLogo assetCode={asset?.assetCode} assetId={asset?.id} /> <span className="ml-2">{asset.assetCode}</span>
                    </Listbox.Option>
                </React.Fragment>
            ));
        }
        return null;
    };

    return (
        <Listbox
            as="div"
            value={selectedAsset}
            onChange={asset => handleSelectAsset(asset)}
            className="bg-white px-4 py-[10px] border border-[#E1E2ED] box-border rounded md:w-[290px] focus:outline-none relative flex flex-row items-center"
        >
            <Listbox.Button
                className="w-full text-left text-[#02083D] text-sm"
                style={{ fontWeight: '500' }}
            >
                {selectedAsset?.assetCode ? (
                    <div className="flex flex-row items-center">
                        <AssetLogo assetCode={selectedAsset?.assetCode} assetId={selectedAsset?.id} size={24} /> <span className="ml-2">{selectedAsset.assetCode}</span>
                    </div>
                ) : `- ${t('filter_all')} -`}
            </Listbox.Button>
            <Transition
                as="div"
                enter="transition ease-out duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options
                    className="absolute top-14 left-0 w-full bg-white z-10 rounded cursor-pointer focus:outline-none"
                    style={{ boxShadow: '0px 12px 24px rgba(7, 12, 61, 0.06)' }}
                >
                    <SearchInput
                        customStyle={customStyle}
                        customWrapperStyle={customFilterWrapperStyle}
                        placeholder={t('search')}
                        handleFilterAssetsList={handleFilterAssetsList}
                    />
                    <div className=" max-h-80 overflow-y-scroll overflow-x-hidden">
                        <Listbox.Option
                            key="all"
                            value={null}
                            className="focus:outline-none text-[#02083D] text-sm px-4 py-[10px] hover:bg-[#00C8BC] hover:text-white rounded"
                        >
                            <p className="h-8 pl-10 flex flex-row items-center">- {t('filter_all')} -</p>
                        </Listbox.Option>
                        {renderOptions()}
                    </div>
                </Listbox.Options>
            </Transition>
        </Listbox>
    );
};

export default TokenSelect;
