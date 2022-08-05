import styled from 'styled-components';
import colors from 'styles/colors';

export const Track = styled.div`
    position: relative;
    margin-left: 4px;
    width: calc(100% - 6.5px);
    cursor: pointer;
    display: flex;
    padding-bottom: 8px;
    padding-top: 8px;
    border-radius: 2px;
    user-select: none;
    box-sizing: border-box;
    height: 4px;
`;

export const Active = styled.div`
    position: absolute;
    background-color:${({ bgColorSlide }) => (bgColorSlide || colors.teal)};
    border-radius: 4px;
    user-select: none;
    box-sizing: border-box;
    height: 2.5px;
    top: 6.5px;
    z-index: 11;
`;

export const SliderBackground = styled.div`
    position: absolute;
    background-color: ${({ isDark }) => (isDark ? colors.darkBlue4 : colors.grey5)};
    border-radius: 4px;
    user-select: none;
    box-sizing: border-box;
    width: 100%;
    top: 6.5px;
    height: 2.5px;
    z-index: 10;
`;

export const DotContainer = styled.div`
    position: absolute;
    z-index: 12;
    width: 100%;
`;

export const Dot = styled.div`
    position: absolute;
    width: 9px;
    height: 10px;
    top: -5px;
    left: ${({ percentage }) => `calc(${percentage}% - 4.5px)`};
    box-sizing: content-box;
    z-index: 30;
    transition: transform 0.2s; /* Animation */

    &:hover {
        background-color:${({ bgColorActive }) => (bgColorActive || colors.teal)};
        transform: scale(1.4);
    }
`;

export const Thumb = styled.div`
    position: relative;
    display: block;
    content: '';
    width: 18px;
    height: 18px;

    user-select: none;
    cursor: pointer;
    pointer-events: none;
`;

export const ThumbLabel = styled.div`
    position: absolute;
    top: -1.25rem;
    right: -10px;
    text-align: center;
    color: ${({ isZero, isDark }) => (isZero ? (isDark ? colors.darkBlue4 : colors.grey5) : colors.teal)};
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
`;
