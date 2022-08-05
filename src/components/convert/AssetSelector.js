import { Popover, Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { Fragment } from 'react';
import { IconSearch } from '../common/Icons';
import AssetSelectorItem from './AssetSelectorItem';

const AssetSelector = ({ assets, type, selectedAsset, setSearch, onSelectAsset }) => {
    const { t } = useTranslation();
    const NoItem = () => (
        <div className="px-6 py-2 mb-4 hover:bg-teal-5 cursor-pointer text-sm font-medium flex items-center">
            {t('common:not_found')}
        </div>
    );

    return (
        <Transition
            show
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
        >
            <Popover.Panel
                className="absolute z-10 transform w-[101%] rounded border border-black-200 -left-0.5 top-11 -right-0.5 bg-white shadow-dropdown"
            >
                <div className="form-group px-6 pt-6 pb-4 !mb-0">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            className="form-control form-control-sm"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button className="btn " type="button">
                                <IconSearch />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-h-[250px] overflow-y-auto pb-4">
                    {
                        assets?.length > 0
                            ? assets.map((a, index) => {
                                const asset = type === 'from' ? a.fromAsset : type === 'to' ? a.toAsset : a.assetCode;
                                return <AssetSelectorItem
                                    key={index}
                                    asset={asset}
                                    type={type}
                                    onSelect={onSelectAsset}
                                    selected={selectedAsset === asset}
                                />;
                            })
                            : <NoItem />
                    }
                </div>
            </Popover.Panel>
        </Transition>
    );
};
export default AssetSelector;
