import { useWindowSize } from 'utils/customHooks';
import { memo, useState } from 'react';

import PocketFooter from 'src/components/common/Footer/PocketFooter';
import useApp from 'hooks/useApp';

const Footer = memo(() => {
    // * Initial State
    const [state, set] = useState({
        active: {}
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    // * Use Hooks
    const { width } = useWindowSize()
    const isApp = useApp()

    if (isApp) return null

    return (
        <section className="mal-footer">
            <div className={`${width >= 1200 ? 'mal-footer___desktop' : ''} mal-footer__wrapper mal-container`}>
                <PocketFooter active={state.active} parentState={setState}/>
                {width < 1200 &&
                <div style={{ fontSize: 12 }} className="font-medium text-gray-2 mt-6">
                    Copyright © 2020 Nami Corporation. All rights reserved.
                </div>
                }
            </div>
        </section>
    )
})

export default Footer
