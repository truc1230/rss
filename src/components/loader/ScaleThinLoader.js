import { ScaleLoader } from 'react-spinners';

import styled from 'styled-components';
import colors from '../../styles/colors';

const ScaleThinLoader = ({ size, thin, height, color }) => {
    return (
        <Wrapper thin={thin} height={height}>
            <ScaleLoader size={size || 3} color={colors.teal || color}/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    span span {
        width: ${({ thin }) => thin ? `${thin}px` : '3px'};
        height: ${({ height }) => height ? `${height}px` : '35px'};
    }
`

export default ScaleThinLoader
