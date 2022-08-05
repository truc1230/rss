import { useSelector } from 'react-redux';
import find from 'lodash/find';
import { useMemo } from 'react';

const AssetName = (props) => {
    const { assetCode, assetId } = props;
    const assetConfig = useSelector(state => state.utils.assetConfig);
    if (!assetConfig) return null;

    const assetName = useMemo(() => {
        const filter = {};
        if (assetCode !== undefined) filter.assetCode = assetCode;
        if (assetId !== undefined) filter.id = assetId;
        const config = find(assetConfig, filter);
        if (config) {
            return config.assetName;
        }
        return '';
    }, [assetCode, assetId]);

    return assetName;
};

export default AssetName;
