import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUsdRate } from 'redux/actions/market';
import { find } from 'lodash';

const ASSET_MODE = {
    EXCHANGE: 'EXCHANGE',
    FUTURES: 'FUTURES',
    STAKING: 'STAKING',
    FARMING: 'FARMING'
}

const INITIAL_STATE = {
    loadingRate: false,
    usdRate: null,
    currentAssetConfigs: null,
    currentWallet: null,

    // Add state here ...
}

const EstimateAsset = ({ assetMode, assetCode, assetId, emptyString, reNew = {} }) => {
    // Init state
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Rdx
    const assetConfigs = useSelector(state => state.utils?.assetConfig) || null
    const exchangeWallets = useSelector(state => state.wallet?.SPOT) || null
    const futuresWallets = useSelector(state => state.wallet?.FUTURES) || null

    // Helper
    const getRate = async () => {
        !state.usdRate && setState({ loadingRate: true })
        const usdRate = await getUsdRate()
        if (usdRate) {
            setState({ usdRate })
        }
        setTimeout(() => setState({ loadingRate: false }), 500)
    }

    useEffect(() => {
        getRate()
    }, [])

    useEffect(() => {
        let interval
        const shouldReNew = reNew?.enable

        if (shouldReNew) {
            interval = setInterval(() => getRate(), reNew?.interval || 1000)
        }
        return () => interval && clearInterval(interval)
    }, [reNew?.enable, reNew?.interval])

    useEffect(() => {
        const finder = {}
        if (assetCode !== undefined) finder.assetCode = assetCode
        if (assetId !== undefined) finder.id = assetId

        const currentAssetConfigs = find(assetConfigs, finder)
        currentAssetConfigs && setState({ currentAssetConfigs })
    }, [assetCode, assetId, assetConfigs])


    return '0.0000'
}

export default EstimateAsset
