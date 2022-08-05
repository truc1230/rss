import { useEffect } from 'react';
import { log } from 'utils';

const Deprecated = (Component) => (props) => {
    useEffect(() => {
        log.w(`${Component?.displayName || Component?.name || 'This Component'} is deprecated.`)
    }, [])
    return (
        <Component {...props}/>
    )
}

export default Deprecated
