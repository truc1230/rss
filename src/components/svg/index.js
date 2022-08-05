import { memo } from 'react';

import SvgActivity from 'src/components/svg/Activity';
import SvgChevronDown from 'src/components/svg/ChevronDown';
import SvgContract from 'src/components/svg/Contract';
import SvgCreditCard from 'src/components/svg/CreditCard';
import SvgCross from 'src/components/svg/Cross';
import SvgExchange from 'src/components/svg/Exchange';
import SvgGlobe from 'src/components/svg/Globe';
import SvgHexagon from 'src/components/svg/Hexagon';
import SvgMenu from 'src/components/svg/Menu';
import SvgMoon from 'src/components/svg/Moon';
import SvgNami from 'src/components/svg/Nami';
import SvgRefresh from 'src/components/svg/Refresh';
import SvgShare from 'src/components/svg/Share';
import SvgSun from 'src/components/svg/Sun';

const SvgIcon = memo((props) => {
    const { name } = props

    switch (name) {
        case 'activity':
            return <SvgActivity {...props} />
        case 'chevron_down':
            return <SvgChevronDown {...props} />
        case 'contract':
            return <SvgContract {...props} />
        case 'credit_card':
            return <SvgCreditCard {...props}/>
        case 'cross':
            return <SvgCross {...props}/>
        case 'exchange':
            return <SvgExchange {...props}/>
        case 'globe':
            return <SvgGlobe {...props}/>
        case 'hexagon':
            return <SvgHexagon {...props}/>
        case 'menu':
            return <SvgMenu {...props}/>
        case 'moon':
            return <SvgMoon {...props}/>
        case 'nami':
            return <SvgNami {...props}/>
        case 'refresh':
            return <SvgRefresh {...props}/>
        case 'share':
            return <SvgShare {...props}/>
        case 'sun':
            return <SvgSun {...props}/>
        default:
            return null
    }
})

export default SvgIcon
