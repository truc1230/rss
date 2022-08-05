import styled from 'styled-components'
import Div100vh from 'react-div-100vh'
import colors from 'styles/colors'
import { theme } from 'tailwind.config'

export const ExternalWdlRoot = styled(Div100vh)`
    padding: 0 18px 15px;
    color: ${colors.darkBlue};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: hidden auto;
    user-select: none;
    background: ${colors.darkBlue2};
    @media (min-width: 375px) {
        padding-left: 20px;
        padding-right: 20px;
    }
`

export const EWHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    margin-right: -18px;
    margin-left: -18px;
    padding: 20px 18px;
     background: ${colors.darkBlue2};
    @media (min-width: 375px) {
        margin-left: -20px;
        margin-right: -20px;
    }
`

export const EWHeaderUser = styled.div`
    display: flex;
    align-items: center;
`

export const EWHeaderUserAvatar = styled.img`
    display: block;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 2px solid ${colors.teal};
    box-shadow: '0px 15px 30px rgba(0, 0, 0, 0.03)';

    @media (min-width: 375px) {
        width: 40px;
        height: 40px;
    }
`

export const EWHeaderUserInfo = styled.div`
    padding-left: 8px;
    line-height: 18px;
`

export const EWHeaderUserName = styled.div`
    font-weight: 600;
    color: ${colors.grey3};
    @media (min-width: 375px) {
        font-size: 16px;
    }
`

export const EWHeaderUserId = styled.div`
    font-size: 12px;
    color: ${colors.grey2};
`

export const EWHeaderTool = styled.div`
    display: flex;
    align-items: center;
    color: ${colors.grey3};
    span {
        display: inline-block;
        padding: 4px 6px;
        font-weight: 600;
    }

    span:first-child {
        margin-right: 16px;
    }

    svg {
        display: block;
        width: 18px;
        height: 18px;
    }
`

export const EWSectionTitle = styled.div`
    width: 100%;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    color: ${colors.white};
    span {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 12px;
        padding: 6px 8px;
        background: ${colors.darkBlue2};
        border-radius: 4px;
        border: 1px solid ${colors.teal};
        color: ${colors.teal};

        :hover {
            background: ${colors.lightTeal};
        }

        img {
            margin-left: 4px;
            width: 18px;
            height: auto;
        }
    }
`

export const EWSectionSubTitle = styled.div`
    width: 100%;
    font-weight: 500;
    font-size: 14px;
    color: ${({ isDark }) => ( colors.grey2)};
    margin-bottom: 1rem;
    span {
        font-weight: 500;
    }
`

export const EWWalletWrapper = styled.div``

export const EWWalletItem = styled.div`
    border-radius: 3px;
    background: ${colors.darkBlue2};
    color: ${colors.grey4};
    box-shadow: '0px 15px 30px rgba(0, 0, 0, 0.03)';
    padding: 12px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 10px;

    :last-child {
        margin-bottom: 0;
    }
`

export const EWWalletTokenIcon = styled.div`
    width: 28px;
    height: 28px;

    img {
        width: 100%;
        height: auto;
    }

    @media (min-width: 375px) {
        width: 32px;
        height: 32px;
    }
`

export const EWWalletTokenInfo = styled.div`
    width: 100%;
`

export const EWWalletTokenInner = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-left: 8px;
    line-height: 18px;
    width: 100%;
`

export const EWWalletTokenAlias = styled.div`
    font-weight: 600;
`

export const EWWalletTokenDescription = styled.div`
    font-size: 10px;
    color: ${({ isDark }) => ( colors.grey2)};
    max-width: ${({ ellipsis }) => (ellipsis ? '55%' : '30%')};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    @media (min-width: 375px) {
        font-size: 12px;
    }
`

export const EWWalletTokenLabel = styled.div`
    font-size: 12px;
    color: ${colors.grey2};
    font-weight: 600;
    color: ${({ isDark }) => colors.teal};
    display: flex;
    align-items: center;
    //text-decoration: dotted;
    //text-decoration-line: underline;

    svg {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;
    }
`

export const EWWalletTokenBalance = styled.div`
    font-size: 14px;
    font-weight: 600;
    font-family: Barlow, serif;

    @media (min-width: 375px) {
        font-size: 16px;
    }
`

export const EWModal = styled(Div100vh)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: ${colors.darkBlue2};
    z-index: ${({ isSuccess }) => (isSuccess ? 1001 : 1000)};
    transform: translateX(${({ active }) => (active ? '0' : '120%')});
    transition: transform 0.2s ease;
    color: ${colors.darkBlue};
    overflow: hidden auto;
    -webkit-overflow-scrolling: touch;
    padding: 24px 18px;
    user-select: none;

    @media (min-width: 375px) {
        padding: 24px 20px;
    }

    .Tool {
        width: 100%;
        margin-bottom: 34px;
        display: flex;
        justify-content: flex-end;

        svg {
            display: block;
            width: 20px;
            height: 20px;
            color: ${colors.grey5};
        }
    }

    .Content {
        height: calc(100% - 43px - 54px - 18px);
        position: relative;

        .Error__ {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            color: darkorange;
            font-style: italic;
            font-size: 12px;
            height: ${({ isError }) => (isError ? '45px' : 0)};
            visibility: ${({ isError }) => (isError ? 'visible' : 'hidden')};
            opacity: ${({ isError }) => (isError ? 1 : 0)};
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .Content__Title {
            font-size: 24px;
            font-weight: bold;
            display: flex;
            align-items: center;
            color: ${colors.grey4};
            img {
                display: block;
                margin-left: 8px;
                width: 24px;
                height: auto;
            }
        }

        .Content__subtitle {
            margin-top: 18px;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
            color: ${colors.grey2};
            display: flex;
            justify-content: space-between;
            align-items: center;

            span:last-child {
                font-style: italic;
                color: orange;
                font-weight: 500;
            }
        }

        .Content__TokenAvailable {
            font-weight: 600;
            text-align: left;
            font-size: 20px;
            font-family: Barlow, serif;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            flex-wrap: wrap;
          color: ${colors.grey4};
            span:last-child {
                font-size: 14px;
                color: ${colors.grey2};
            }
        }

        .Input__wrapper {
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
            padding: 10px 12px;

            input {
                border: none;
                outline: none;
                color: ${colors.grey5};
                font-size: 18px;
                font-family: Barlow, serif;
                font-weight: 600;
                width: 100%;
                padding-right: 10px;
                background: transparent;
                user-select: text;

                ::placeholder {
                    font-size: 13px;
                    font-weight: 500;
                }
            }

            .Max_otp {
                color: ${colors.teal};
                font-weight: 600;
                padding: 1px 5px;
                font-size: 12px;
                margin-right: 6px;
                white-space: nowrap;
                border-radius: 6px;
            }

            .Token__unit {
                font-size: 12px;
                padding-left: 6px;
                border-left: 2px solid #202C4C;
                color: ${colors.grey4};
                font-weight: 600;
            }
        }

        .Content__SliderAmount {
            margin: 24px 0;
            padding: 0 10px;
            position: relative;

            .input-range__slider {
                transform: scale(1.3);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                border-color: ${'rgba(0, 0, 0, .8)'};
                background: ${colors.teal};
                border-width: 3px;
            }

            .input-range__label--value {
                display: ${({ shouldHideSliderLabel }) =>
                    shouldHideSliderLabel ? 'none' : 'block'};
            }

            .input-range__label-container {
                bottom: 15px;
                display: block;
                padding: 3px 6px;
                background: ${colors.teal};
                min-width: 35px;
                text-align: center;
                color: #fff;
                font-weight: 600;
                border-radius: 3px;
                max-width: 50px;
                font-family: Barlow, serif;

                :before {
                    content: '';
                    position: absolute;
                    bottom: 100%;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 6px;
                    background-color: ${colors.teal};
                    clip-path: polygon(50% 100%, 0 0, 100% 0);
                }

                :after {
                    content: '%';
                    font-size: 12px;
                }
            }

            .input-range__track {
                background: ${({ isDark }) =>
                    isDark
                        ? 'rgba(255, 255, 255, 0.09)'
                        : 'rgba(0, 0, 0, 0.09)'};
            }

            .input-range__track--active {
                background: ${colors.teal};
            }

            .input-range__slider:active {
                transform: scale(1.3);
            }

            .input-range__label--max,
            .input-range__label--min {
                display: none !important;
            }
        }

        .Content__AdditionalInfo {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin: 8px 0;
            color: ${colors.grey5};
            span:first-child {
                color: ${colors.grey4};
                font-size: 12px;
            }

            span:last-child {
                font-size: 14px;
                font-family: Barlow, serif;
                font-weight: 600;
            }
        }

        // success modal
        .Content__Success_Graphic {
            width: 100%;
            text-align: center;
            height: 120px;
            position: relative;
            margin-bottom: 2rem;

            .backward {
                position: absolute;
                width: 150px;
                height: 150px;
                top: 52%;
                left: 50%;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
                background: ${colors.lightTeal};
            }

            img {
                display: block;
                margin: auto;
                max-height: ${({ isMaintain }) =>
                    isMaintain ? '140px' : '120px'};
                width: auto;
                z-index: 2;
            }
        }

        .Content__Success_Notice {
            font-weight: 600;
            font-size: 18px;
            width: 100%;
            text-align: center;
            margin: 24px 0 16px;
            font-family: Barlow, serif;
            color: ${colors.grey5};
        }

        .Content__WithdrawVal {
            font-weight: bolder;
            text-align: center;
            font-size: 24px;
            font-family: Barlow, serif;
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            justify-content: center;
            color: ${colors.grey5};
            span:last-child {
                font-weight: 600;
                margin-left: 4px;
                font-size: 18px;
                color: ${colors.grey5};
            }
        }

        .Content__AfterWdl {
            margin-top: 34px;
            font-family: Barlow, serif;

            .AfterWdl__Info {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                flex-wrap: wrap;
                font-weight: 500;
                font-size: 12px;
                margin-bottom: 8px;
                color: ${colors.grey5};
                :last-child {
                    margin-bottom: 0;
                }

                span:first-child {
                    color: ${colors.grey5};
                }
                span:last-child {
                    font-weight: bold;
                    font-size: 14px;
                }
            }
        }

        .Content__SuccessTips {
            width: 100%;
            display: flex;
            align-items: flex-start;
            border-radius: 5px;
            background: ${colors.lightTeal};
            padding: 8px 12px;
            margin-top: 24px;
            font-size: 12px;

            span {
                margin-top: -2px;
                display: inline-flex;
                padding-left: 10px;
                color: ${colors.teal};
                font-family: Barlow, serif;
                font-weight: 500;
            }
        }

        .Content__Maintainance {
            text-align: center;
            margin-top: 15px;

            .additional_content__timeline {
                font-family: Barlow, serif;
                font-weight: 500;

                span {
                    display: inline-block;

                    span {
                        color: ${({ isDark }) => colors.teal};
                        font-weight: 600;
                    }
                }
            }

            span span {
                font-weight: 600;
            }
        }
    }

    .Wdl__Button {
        height: 43px;

        a {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            width: 100%;
            margin: auto;
            height: 43px;
            text-align: center;
            line-height: 43px;
            border-radius: 4px;
            color: #fff;
            transition: all 0.4s ease;
           background: ${({ theme, shouldDisableWdl, isDark }) =>
                shouldDisableWdl
                    ? colors.darkBlue2
                    : colors.teal};
            pointer-events: ${({ shouldDisableWdl }) =>
                shouldDisableWdl ? 'none' : 'auto'};

            .css-0 {
                height: 80%;
                display: flex;
                align-items: center;

                div {
                    height: 14px;
                    width: 2px;
                    margin: 1px;
                }
            }

            svg {
                margin-left: 11px;
            }

            :hover,
            :active {
                opacity: 0.88;
            }
        }
    }
`

export const DIM = styled(Div100vh)`
    width: 100%;
    background: ${({ isDark }) =>
        true ?  'rgba(0, 0, 0, .8)' : 'rgba(255, 255, 255, .88)'};
    visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
    opacity: ${({ active }) => (active ? 1 : 0)};
    transition: all 0.3s ease;
    z-index: 1000;
    top: 0;
    left: 0;
    position: absolute;
`

export const NoticePopup = styled.div`
    position: absolute;
    top: ${({ active }) => (active ? '50%' : '-100%')};
    left: 50%;
    transform: translate(-50%, ${({ active }) => (active ? '-50%' : '-100%')});
    transition: transform 0.3s ease;
    width: 80%;
    max-width: 320px;
    height: auto;
    min-height: 60px;
    z-index: 1001;
    border-radius: 4px;
    background: ${({ isDark }) => (!true ?  colors.white : colors.darkBlue2)};
    color: ${({ isDark }) => (true ?  colors.grey5 : colors.darkBlue)};
    box-shadow: '0px 15px 30px rgba(0, 0, 0, 0.03)';

    .NoticePopup__Header {
        height: 38px;
        width: 100%;
        text-align: center;
        line-height: 38px;
        font-size: 13px;
        font-weight: bold;
        border-bottom: 1px solid
            ${({ isDark }) => (true ?  '#202C4C' : colors.grey4)};
        letter-spacing: 1px;
    }

    .NoticePopup__Content {
        padding: 8px 12px;
        text-align: center;
        font-family: Barlow, serif;
        font-weight: 400;

        svg {
            display: block;
            margin: 12px auto;
        }

        a {
            display: block;
            width: 80%;
            padding: 6px 0;
            border-radius: 4px;
            text-align: center;
            font-size: 13px;
            background: linear-gradient(180deg, #00d3e7 0%, #00b5c6 100%);
            margin: 15px auto 8px;
            transition: opacity 0.3s ease;
            font-weight: 600;
            color: #fff;
            font-family: Source Sans Pro, serif;

            :hover {
                opacity: 0.8;
            }
        }
    }
`

export const MoreToken = styled.div`
    margin: 15px auto 25px;
    font-size: 12px;
    font-weight: 600;
    width: 100%;
    text-align: center;
    color: ${colors.teal};

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 3px;
    }
`
