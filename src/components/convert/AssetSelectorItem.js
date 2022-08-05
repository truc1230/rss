import AssetLogo from '../wallet/AssetLogo';
import { IconCheck } from '../common/Icons';

const AssetSelectorItem = ({ asset, selected, onSelect }) => {
    return (
        <div
            className="px-6 py-2 hover:bg-teal-5 cursor-pointer text-sm font-medium flex items-center"
            key={asset}
            onClick={() => onSelect(asset)}

        >
            <div className="mr-2 flex items-center">
                <AssetLogo assetCode={asset} size={24} />
            </div>
            <span className="flex-grow">{asset}</span>
            {
                selected
                && (
                    <span className="text-teal-700 ">
                        <IconCheck />
                    </span>
                )
            }
        </div>
    );
};

export default AssetSelectorItem;
