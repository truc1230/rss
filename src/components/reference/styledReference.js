import styled from 'styled-components';
import colors from '../../styles/colors';

export const DesktopWrapper = styled.div`
    width: 100%;
    background: #FFFFFF;
    display:flex;
    justify-content:center;
`

export const Containerz = styled.div`
    z-index: 8;
    max-width: 1145px !important;
    display:flex;
    justify-content:space-evenly;
    width: 100%;
    padding: 0 10px;

`

export const ContentContainerz = styled.div`
    z-index: 8;
    max-width: 1145px !important;
    display:flex;
    justify-content:space-evenly;
    width: 100%;
    flex-direction: column;
    padding: 0 10px;
`

export const BannerContainer = styled.div`
    background: linear-gradient(274.75deg, #00B6C7 23.19%, #00DCC2 117.39%);
    padding-top: 110px;
    padding-bottom: 24px;
    display: flex;
    justify-content:center;

    @media (min-width: 1200px) {
        padding-top: 128px;
        padding-bottom: 42px;
    }

    @media (min-width: 1300px) {
        padding-top: 128px;
        padding-bottom: 60px;
    }
`

export const BannerLeft = styled.div`
    font-size: 44px;
    font-weight: 600;
    color: #FFFFFF;
    text-align: center;
    padding-top: 14px;
    min-width: 250px;
    line-height: 30px;


    @media (max-width: 768px) {
        line-height: 20px;
        margin-top: -12px;
        line-height: 35px;

    }

    span {
        > span:last-child {
            display: block;
            margin-top: -6px;

            @media (min-width: 1200px) {
                line-height: 20px;
                margin-top: -12px;
            }

            @media (min-width: 1440px) {
                line-height: 20px;
                margin-top: -18px;
            }
        }
    }

    @media (min-width: 768px) {
        text-align: left;
        font-size: 28px;
    }

    @media (min-width: 992px) {
        font-size: 32px;
    }

    @media (min-width: 1200px) {
        font-size: 42px;
        padding-top: 9px;
    }

    @media (min-width: 1440px) {
        font-size: 52px;
        padding-top: 12px;
    }
`

export const SubParagrapgh = styled.div`
    color: #FFFFFF;
    text-align: center;
    font-size: 16px;
    font-weight: 300;
    padding-left: 1px;
    margin: 30px 0 20px;

    span {
        font-weight: 300;

        span {
            white-space: nowrap !important;
            display: inline !important;
        }
    }

    @media (min-width: 768px) {
        text-align: left;
    }
`

export const BannerButtonGroup = styled.div`
    margin-top: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 1px;
    visibility: hidden;

    button {
        max-width: 120px !important;
        white-space: nowrap;
        filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.25));

        :last-child {
            margin-left: 14px
        }

        @media (min-width: 768px) {
            font-size: 14px !important;
        }

        @media (min-width: 1200px) {
            max-width: 128px !important;
            padding: 10px 30px !important;
        }
    }

    @media (min-width: 768px) {
        justify-content: flex-start;
    }
`

export const TextTransparent = styled.span`
    background: linear-gradient(274.75deg, #00B6C7 23.19%, #00DCC2 117.39%);
    font-weight: bold;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

export const BannerRight = styled.div`
    border-radius: 6px;
    overflow: hidden;
    margin-top: 24px;
    background: rgba(0, 0, 0, 0.9);
    box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.25);
    width: 100%;
    min-width:250px;
    
    @media (min-width: 768px) {
        margin-top: 0;
        width: 50%;
    }
`

export const AnalyticTopLine = styled.div`
    height: 9px;
    width: 100%;
    background: #00DCC2;
`

export const AnalyticWrapper = styled.div`
    padding: 17px 22px 21px 22px;
    width: 100%;
`

export const AnalyticTitle = styled.div`
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
    color: rgba(229, 229, 229, 0.7);

    div:first-child {
        color: #E5E5E5;
    }

    div:last-child {
        color: #00DCC2;
    }
`

export const ReferralID = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    cursor: pointer;

    div {
        color: #00DCC2
    }

    div:first-child {
        font-weight: 600;
        font-size: 24px;
        margin-right: 10px;
        font-family: Barlow, serif;

        @media (min-width: 1200px) {
            font-size: 30px;
        }

        @media (min-width: 1440px) {
            font-size: 34px;
        }
    }

    div:last-child {
        svg {
            width: 14px;
            height: auto
        }
    }
`

export const CopyIcon = styled.div`
    svg {
        width: 14px;
        height: auto;
        color: #00DCC2;
    }
`

export const ReferralLink = styled.div`
    color: #FFFFFF;
    display: flex;
    align-items: center;
    margin-top: 7px;
    cursor: pointer;

    svg {
        margin-left: 10px;
    }
`

export const AnalyticCommission = styled.div`
    padding: 12px;
    display: flex;
    justify-content: space-between;
    background: #1D1D1D;
    border-radius: 3px;
    margin-top: 17px;

    div {
        width: 50%;

        div:first-child {
            margin-bottom: 9px;
            color: rgba(255, 255, 255, 0.7);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            padding-right: 12px;
        }

        div:last-child {
            color: #FFFFFF;
            font-size: 20px;
            font-weight: bold;
            font-family: Barlow, serif;

            @media (min-width: 1200px) {
                font-size: 24px;
            }
        }
    }
`

export const ReferralCatergories = styled.div`
    display:flex;
    justify-content:center;
    width: 100%;
    background: rgba(0, 0, 0, 0.85);
    position: sticky;
    top: 0;
    z-index: 9;
`

export const ReferralCatergoriesWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
    overflow: auto;
    max-width: 1145px !important;

    ::-webkit-scrollbar {
        display: none;
    }
`

export const ReferralCatergoriesItem = styled.div`
    padding: 14px 18px;
    text-align: center;
    width: auto;
    color: #FFFFFF;
    font-weight: 600;
    position: relative;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;

    a {
        color: #FFFFFF;

        :hover {
            color: #FFFFFF;
        }
    }

    :after {
        content: '';
        height: 3px;
        width: 96%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: ${colors.mint};
        display: ${({active}) => active ? 'block' : 'none'};
    }

    @media (min-width: 1440px) { font-size: 16px }
`

export const ContentWrapper = styled.div`
    padding-top: 32px;
    padding-bottom: 32px;
`

export const ComponentTitle = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    svg {
        width: 28px;
        height: 28px;
        margin-right: 8px
    }

    div {
        color: #000000;
        font-size: 20px;
        font-weight: 600;
        margin-left: 2px;

        @media (min-width: 768px) {
            margin-left: 6px;
        }

        @media (min-width: 1200px) {
            font-size: 28px;
            margin-left: 8px;
        }
    }
`

export const ComponentTabWrapper = styled.div`
    width: 100%;
    border-bottom: 1px solid #E5E5E5;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
`

export const ComponentTabItem = styled.div`
    padding: 14px 18px;
    text-align: center;
    width: auto;
    font-weight: ${({active}) => active ? 600 : 500};
    position: relative;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    color: #000000;

    :after {
        content: '';
        height: 3px;
        width: 96%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: ${colors.mint};
        display: ${({active}) => active ? 'block' : 'none'};
    }
`

export const ComponentSortWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-top: 24px;
    overflow: auto;

    ::-webkit-scrollbar {
        display: none;
    }
`

export const ComponentSortItem = styled.div`
    padding: 4px 14px;
    border: 1px solid ${({active}) => active ? colors.mint : '#E5E5E5'};
    border-radius: 3px;
    background: ${({active}) => active ? 'rgba(0, 182, 199, 0.1)' : '#FFFFFF'};
    color: ${({active}) => active ? colors.mint : '#000000'};
    white-space: nowrap;
    margin-right: 16px;
    cursor: pointer;
    user-select: none;

    :last-child {
        margin-right: 0;
    }
`

export const TimeRange = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    @media (min-width: 768px) {
        flex-wrap: nowrap;
    }
`

export const DateRange = styled.div`
    font-size: 12px;
    font-weight: 300;
    color: #000000;
    margin-top: 16px;
    white-space: nowrap;

    span {
        font-weight: 600;
        white-space: nowrap;
    }

    @media (min-width: 768px) {
        display: flex;
    }

    @media (min-width: 992px) {
        font-size: 13px;
    }

    @media (min-width: 1200px) {
        font-size: 14px;
    }
`

export const ReferralNote = styled.div`
    color: rgba(0, 0, 0, 0.7);
    margin-top: 28px;
    font-size: 12px;

    @media (min-width: 992px) {
        font-size: 13px;
    }

    @media (min-width: 1200px) {
        font-size: 14px;
    }
`

export const ComponentDescription = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 16px 0;

    div {
        font-size: 12px;

        @media (min-width: 992px) {
            font-size: 13px;
        }

        @media (min-width: 1200px) {
            font-size: 14px;
        }
    }

    div:first-child {
        color: rgba(0, 0, 0, 0.7);

        @media (min-width: 768px) {
            max-width: 60%;
        }
    }

    div:last-child {
        color: #00B6C7;
        cursor: pointer;
        position: relative;
        user-select: none;

        :after {
            content: '';
            width: 95%;
            height: 1px;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #00B6C7;
            margin-top: 2px;
            display: none;
        }

        :hover {
            :after {
                display: block;
            }
        }

        span {
            color: #00B6C7;

            svg {
                margin-top: -3px;
                width: 15px;
                height: auto;
                margin-right: 8px;
            }
        }
    }
`

export const ComponentTableWrapper = styled.div`
    .rc-table-content {
        position: relative;
        overflow: auto hidden;

        ::-webkit-scrollbar {
            height: 3px !important;
        }
    }

    table {
        min-width: 720px;
        width: 100%;
        table-layout: auto;
        border: 1px solid rgb(245, 245, 245);

        td, th {
            white-space: nowrap;
            padding: 12px 16px;
        }

        thead {
            font-size: 12px;
            background: rgba(229, 229, 229, 0.3);

            th {
                font-weight: 500 !important;
                color: rgba(0, 0, 0, 0.7);
            }

            @media (min-width: 992px) {
                font-size: 13px;
            }

            @media (min-width: 1200px) {
                font-size: 14px;
            }
        }

        tbody {
            font-size: 12px;

            tr {
                :hover {
                    background: rgba(245, 245, 245, .5);
                }
            }

            td {
                color: #000000;
            }

            @media (min-width: 992px) {
                font-size: 13px;
            }

            @media (min-width: 1200px) {
                font-size: 14px;
            }
        }
    }
`

export const SortIcon = styled.span`
    svg {
        width: 24px;
        height: 24px;
    }
`

export const DivLine = styled.div`
    width: 100%;
    height: 1px;
    background: rgba(217, 217, 217, 0.5);
`

export const Pagination = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    margin: 20px 0 4px;
    user-select: none;

    i {
        color: ${colors.mint3}
    }

    .disabled {
        i {
            color: lightgrey;
        }

        pointer-events: none;
    }

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        cursor: pointer;
        text-align: center;
        height: 24px;
        border-radius: 5px;
        box-shadow: 0 1px 30px 1px rgba(0, 0, 0, 0.08);
        background: #FFF;
    }

    div {
        margin: 0 1rem;
        padding: 6px 10px;
        border-radius: 10px;
        box-shadow: 0 1px 30px 1px rgba(0, 0, 0, 0.08);
        color: ${colors.black};
        background: #FFF;

        @media (min-width: 1600px) {
            padding: 8px 18px;
            margin: 0 2rem;
        }
    }

    @media (min-width: 1600px) {
        span {
            width: 32px;
            height: 32px;
        }

        margin: 40px 0 16px;
        font-size: 16px !important;
    }
`
