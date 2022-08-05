import { useSelector } from 'react-redux';
import find from 'lodash/find';
import { useMemo } from 'react';
import { formatNumber } from 'redux/actions/utils';

const AssetValue = (props) => {
    const { assetCode, assetId, value, assetDigit } = props
    const assetConfig = useSelector(state => state.utils.assetConfig)
    if (!assetConfig) return null

    return useMemo(() => {
        const filter = {}
        if (assetCode !== undefined) filter.assetCode = assetCode
        if (assetId !== undefined) filter.id = assetId
        const config = find(assetConfig, filter)
        if (config?.assetDigit) {
            return value === 0 || !value ? '0.0000' : formatNumber(value, assetDigit || config.assetDigit)
        }
        return ''
    }, [assetCode, assetId])
}

export default AssetValue
