import { useEffect, useState } from 'react';
import { getUsdRate } from 'redux/actions/market';

const INITIAL_STATE = {

}

const ReferencePrice = ({ assetCode }) => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Helper
    const getRate = async () => {
        setState({ loading: true })
        const data = await getUsdRate()
        console.log('namidev-DEBUG: => ', data)
        setState({ loading: false })
    }

    useEffect(() => {
        getRate()
    }, [])

    return '--'
}

export default ReferencePrice
