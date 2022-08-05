// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');
const defaultTheme = require("tailwindcss/defaultTheme");


// Common colors
const commonColors = {
    transparent: 'transparent',

    darkBlue: '#223050',
    darkBlue1: '#00091F',
    darkBlue2: '#151D2F',
    darkBlue3: '#263459',
    darkBlue4: '#445271',
    darkBlue5: '#7B8CB2',

    gray1: '#718096',
    gray2: '#A0AEC0',
    gray3: '#CBD5E0',
    gray4: '#F2F4F6',
    gray5: '#EDF1F6',

    white: 'white',
    teal: '#00C8BC',
    lightTeal: '#E2F6F5',

    red2: '#E5544B',

    onus: {
        bg: '#1B222D',
        bg2: '#36445A',
        bg3: '#243042',
        bgModal: '#243042',
        bgModal2: '#1e1e1e',
        bgModal3: '#090D17',
        base: '#0068FF',
        green: '#0DB787',
        red: '#DC1F4E',
        line: '#2B3247',
        input: '#243042',
        input2: '#36445A',
        white: '#F6F6F6',
        textPrimary: '#F6F6F6',
        grey: '#8492A7',
        grey2: '#445571',
        textSecondary: '#8492A7',
        orange: '#FF9F1A',

    },
    nao: {
        bg: '#619095',
        bg2: '#12182B',
        bg3: '#192138',
        bg4: '#202E42',
        text: '#B9CCFF',
        text2: '#A6BFE6',
        grey: '#7686B1',
        grey2: '#7586AD',
        white: '#F6F6F6',
        blue: '#27CEE0',
        blue2: '#093DD1',
        blue3: '#99C3FF',
        green: '#49E8D5',
        green2: '#0DB787',
        yellow: '#F3BA2F',
        line: '#1C2644',
        border: '#4AEDFF',
        border2: '#18223E',
        bgModal: '#161D32',
        bgModal2: '#00030D',
        bgShadow: '#000921',
        red: '#DC1F4E',
        tooltip: '#0E1D32',
    }
};

module.exports = {
    // future: {
    //     removeDeprecatedGapUtilities: true,
    //     purgeLayersByDefault: true,
    // },
    mode: 'jit',
    purge: [
        './src/pages/**/**/*.{js,ts,jsx,tsx}',
        './src/components/**/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900,
        },
        fontFamily: {
            sans: ['Barlow', 'sans-serif'],
            serif: ['serif'],
            inter: ['Inter', 'sans-serif'],
        },
        fontSize: {
            xxs: [
                '.625rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1rem',
                },
            ], // Outline 10px
            xs: [
                '.75rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.125rem',
                },
            ], // Caption 12px
            sm: [
                '.875rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.3125rem',
                },
            ], // Small text 14px
            tiny: [
                '.875rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.3125rem',
                },
            ], // 14px
            base: [
                '1rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.5rem',
                },
            ], // 16px
            lg: [
                '1.125rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '1.75rem',
                },
            ], // Body 2 18px
            xl: [
                '1.3125rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '2rem',
                },
            ], // Body 1, Heading 6 21px
            '2xl': [
                '1.5rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '2.25rem',
                },
            ], // Heading 5 24px
            '3xl': [
                '1.75rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '2.5rem',
                },
            ], // Heading 4 28px
            '4xl': [
                '2.25rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '3.5rem',
                },
            ], // Heading 3 36px
            '5xl': [
                '2.5rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '3.5rem',
                },
            ], // Heading 2 40px
            '6xl': [
                '4rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '4.5rem',
                },
            ], // Heading 1 64px
            '5.5xl': [
                '3.5rem',
                {
                    letterSpacing: '-0.01em',
                    lineHeight: '4.25rem',
                },
            ], // Heading 2 56px
        },
        // TODO split text, background
        colors: {
            dominant: commonColors.teal,
            transparent: 'transparent',
            current: 'currentColor',

            listItemSelected: {
                DEFAULT: commonColors.lightTeal,
                dark: commonColors.darkBlue3,
            },

            divider: {
                DEFAULT: commonColors.gray4,
                dark: '#202C4C',
            },

            //--------------------------------------------
            black: {
                DEFAULT: '#02083D',
                5: '#F7F6FD', // 9
                50: '#F8F7FA', // 8
                100: '#F6F9FC', // 7
                200: '#EEF2FA', // 6
                300: '#E1E2ED', // 5
                400: '#C5C6D2', // 4
                500: '#8B8C9B', // 3
                600: '#3e3b3b', // 2
                700: '#02083D', // 1,
                800: '#000000',
            },
            white: colors.white,
            blue: {
                DEFAULT: '#384562',
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#a7acb9',
                400: '#9198a8',
                500: '#7a8396',
                600: '#646e85',
                700: '#4e5973',
                800: '#384562',
                900: '#223050',
            },
            darkBlue: {
                DEFAULT: '#223050',
                1: commonColors.darkBlue1,
                2: commonColors.darkBlue2,
                3: commonColors.darkBlue3,
                4: commonColors.darkBlue4,
                5: commonColors.darkBlue5,
                '5a': 'rgba(123, 140, 178, 0.8)',
            },
            gray: {
                DEFAULT: '#8D9091',
                ...colors.gray,
                1: commonColors.gray1,
                2: commonColors.gray2,
                3: commonColors.gray3,
                4: commonColors.gray4,
                5: commonColors.gray5,
            },
            teal: {
                DEFAULT: '#00C8BC',
                5: '#03bdce17',
                50: '#b3efeb',
                100: '#99e9e4',
                200: '#80e4de',
                300: '#4dd9d0',
                400: '#33d3c9',
                500: '#1acec3',
                600: '#00C8BC',
                700: '#00C8BC',
                lightTeal: '#E2F6F5',
                opacity: 'rgba(0, 200, 188, 0.5)',
                opacitier: 'rgba(0, 200, 188, 0.1)',
            },
            green: {
                DEFAULT: '#22B02E',
                opacity: 'rgba(34, 176, 46, 0.18)',
            },
            yellow: { DEFAULT: '#FFD965' },
            red: {
                DEFAULT: '#E5544B',
                lightRed: '#E5544B19',
            },
            pink: { DEFAULT: '#E5544B' },
            mint: { DEFAULT: '#00C8BC' },

            onus: {
                DEFAULT: commonColors.onus.bg,
                1: commonColors.onus.bg2,
                2: commonColors.onus.bg3,
                ...commonColors.onus,
            },
            nao: {
                DEFAULT: commonColors.nao.bg,
                ...commonColors.nao,
            },
        },
        extend: {
            screens: {
                'nao': '1160px',
            },
            spacing: {
                128: '32rem',
                144: '36rem',
            },
            // borderRadius: {
            //     'xl': '0.625rem',
            //     '3xl': '1.25rem'
            // },
            borderColor: ['group-focus'],
            placeholderColor: {
                txtSecondary: {
                    DEFAULT: commonColors.gray1,
                    dark: commonColors.darkBlue5,
                },
            },
            textColor: {
                txtPrimary: {
                    DEFAULT: commonColors.darkBlue,
                    dark: commonColors.gray4,
                },
                txtSemiPrimary: {
                    DEFAULT: commonColors.gray2,
                    dark: commonColors.darkBlue4,
                },
                txtSecondary: {
                    DEFAULT: commonColors.gray1,
                    dark: commonColors.darkBlue5,
                },

                txtBtnPrimary: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.white,
                },
                txtBtnSecondary: {
                    DEFAULT: commonColors.teal,
                    dark: commonColors.teal,
                },
                txtTabInactive: {
                    DEFAULT: commonColors.gray1,
                    dark: commonColors.darkBlue5,
                },
                txtTabActive: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.white,
                },
                onus: {
                    DEFAULT: commonColors.onus.white,
                    secondary: commonColors.onus.grey,
                },
            },
            backgroundColor: {
                bgTabInactive: {
                    DEFAULT: commonColors.gray4,
                    dark: commonColors.darkBlue3,
                },
                bgTabActive: commonColors.teal,
                bgPrimary: {
                    DEFAULT: commonColors.white,
                    dark: commonColors.darkBlue2,
                },
                bgSecondary: {
                    DEFAULT: commonColors.gray4,
                    dark: commonColors.darkBlue5,
                },
                bgContainer: {
                    DEFAULT: '#fff',
                    dark: commonColors.darkBlue2,
                },
                bgSpotContainer: {
                    DEFAULT: '#fff',
                    dark: commonColors.darkBlue1,
                },
                headerBg: {
                    DEFAULT: 'rgba(0, 0, 0, 0.3)',
                    dark: 'rgba(0, 0, 0, 0.3)',
                },
                homepageBg: {
                    DEFAULT: '#f2f4f66e',
                    dark: commonColors.darkBlue2,
                },
                bgBtnPrimary: {
                    DEFAULT: commonColors.teal,
                    dark: commonColors.teal,
                },
                bgBtnSecondary: {
                    DEFAULT: commonColors.gray4,
                    dark: commonColors.darkBlue,
                },
                bgInput: {
                    DEFAULT: commonColors.gray5,
                    dark: commonColors.darkBlue3,
                },
                bgHover: {
                    DEFAULT: 'rgba(245, 245, 245, 0.5)',
                    dark: 'rgba(38, 52, 89, 0.3)',
                },
                bgCondition: {
                    DEFAULT: 'rgba(255, 247, 235, 0.2)',
                    dark: 'rgba(255, 247, 235, 0.2)',
                }
            },
            fontWeight: { bold: 600 },
            dropShadow: {
                common: '0px 15px 30px rgba(0, 0, 0, 0.03)',
                onlyLight: '0px 7px 23px rgba(0, 0, 0, 0.05)',
                onlyDark: '0px 7px 23px rgba(245, 245, 245, 0.05)',
            },
            boxShadow: {
                onlyLight: '0px 7px 23px rgba(0, 0, 0, 0.05)',
                'features': '0px 10px 30px rgba(89, 111, 153, 0.05)',
                mobile: '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03)',
                order_detail: '0px -4px 30px rgba(0, 0, 0, 0.08)',
                nao: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            },
            cursor: {
                grabbing: 'grabbing'
            }
        },
    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
            display: ['group-hover'],
            visibility: ['group-hover'],
            cursor: ['grabbing'],
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/line-clamp'),
    ],
};
