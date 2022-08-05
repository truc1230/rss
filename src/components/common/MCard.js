// ********* Maldives Card *********
// Version: M1
// Author:
// ---------------------------------

import { useEffect, useRef } from 'react';

const MCard = ({ children, getRef, addClass, style }) => {
    const ref = useRef()

    useEffect(() => {
        ref?.current && getRef && getRef(ref.current)
    }, [ref, getRef])

    return (
        <div style={style ? { ...style } : {}}
             ref={ref}
             className={addClass ? 'px-4 py-5 rounded-xl bg-bgContainer dark:bg-bgContainer-dark text-textTabLabelInactive ' + addClass
                 : 'px-4 py-5 rounded-xl bg-bgContainer dark:bg-bgContainer-dark '}>
            {children}
        </div>
    )
}

export default MCard






