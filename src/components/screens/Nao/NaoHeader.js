import React, { useState, useRef, useEffect, memo } from "react";
import styled from "styled-components";
import useLanguage, { LANGUAGE_TAG } from "hooks/useLanguage";
import { useTranslation } from "next-i18next";
import SvgMenu from "src/components/svg/Menu";
import { useWindowSize } from "utils/customHooks";
import colors from "styles/colors";
import Portal from "components/hoc/Portal";
import classNames from "classnames";
import { X } from "react-feather";
import {
    Divider,
    ButtonNao,
    useOutsideAlerter,
} from "components/screens/Nao/NaoStyle";
import { getS3Url } from "redux/actions/utils";
import { useRouter } from "next/router";
const category = [
    {
        label: "Whitepaper",
        link: "https://naotoken.gitbook.io/du-an-nao/thong-tin-co-ban/tokenomics",
        options: "_blank",
    },
    { label: "performance", el: "nao_performance", url: "/nao" },
    { label: "governance_pool", el: "nao_pool", url: "/nao" },
    // { label: 'buy_token', el: 'nao_token' },
    { label: "Stake NAO", link: "/nao/stake", options: "_self" },
    { label: "voting", el: "nao_proposal", url: "/nao" },
    { label: "contest_futures", link: "/contest", options: "_self" },
];

const NaoHeader = memo(({ onDownload }) => {
    const [currentLocale, onChangeLang] = useLanguage();
    const {
        t,
        i18n: { language },
    } = useTranslation();
    const { width } = useWindowSize();
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const el = useRef(null);

    const scrollToView = (item) => {
        if (!item?.el) {
            if (item.link)
                item?.options === "_self"
                    ? router.push(item.link)
                    : window.open(item.link, item.options);
        } else {
            if (item?.url && router.route !== item?.url) {
                el.current = item.el;
                router.push(item.url);
            } else {
                const _el = document.querySelector("#" + item.el);
                if (_el) _el.scrollIntoView();
            }
        }
        if (visible) setVisible(false);
    };
    useEffect(() => {
        router.events.on("routeChangeComplete", () => {
            const _el = document.querySelector("#" + el.current);
            if (_el) {
                _el.scrollIntoView();
                el.current = null;
            }
        });
    }, [router, el.current]);

    return (
        <div className="nao_header flex justify-between items-center h-[90px] relative">
            <Drawer
                visible={visible}
                onClose={() => setVisible(false)}
                onChangeLang={onChangeLang}
                language={language}
                t={t}
                scrollToView={scrollToView}
                onDownload={onDownload}
            />
            <img
                onClick={() => router.push("/nao")}
                src={getS3Url("/images/nao/ic_nao.png")}
                width="40"
                height="40"
                className="min-w-[2.5rem]"
            />
            <div
                className={`flex items-center text-nao-text font-medium ${width > 820 ? "space-x-10" : "space-x-4"
                    }`}
            >
                {width > 820 && (
                    <>
                        {category.map((item) => (
                            <div
                                key={item.label}
                                onClick={() => scrollToView(item)}
                                className="cursor-pointer"
                            >
                                {t(`nao:${item.label}`)}
                            </div>
                        ))}
                        <div className="flex items-center p-2 bg-nao-bg2 rounded-[4px] select-none space-x-2">
                            <Language
                                onClick={() =>
                                    language !== LANGUAGE_TAG.VI &&
                                    onChangeLang()
                                }
                                active={language === LANGUAGE_TAG.VI}
                            >
                                VI
                            </Language>
                            <Language
                                onClick={() =>
                                    language !== LANGUAGE_TAG.EN &&
                                    onChangeLang()
                                }
                                active={language === LANGUAGE_TAG.EN}
                            >
                                EN
                            </Language>
                        </div>
                    </>
                )}
                {width <= 820 && (
                    <>
                        <ButtonNao
                            onClick={() => router.push("/nao/stake")}
                            className="!rounded-md h-10 px-6 text-nao-white"
                        >
                            Stake NAO
                        </ButtonNao>
                        <div
                            className="relative"
                            onClick={() => setVisible(true)}
                        >
                            <SvgMenu
                                size={25}
                                className={"cursor-pointer select-none"}
                                color={colors.nao.text}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

const Drawer = ({
    visible,
    onClose,
    language,
    onChangeLang,
    t,
    scrollToView,
    onDownload,
}) => {
    const wrapperRef = useRef(null);
    const timer = useRef(null);
    const handleOutside = () => {
        if (visible && onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (visible) {
            document.body.classList.add("overflow-hidden");
        } else {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                document.body.classList.remove("overflow-hidden");
            }, 300);
        }
    }, [visible]);

    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    const _scrollToView = (el) => {
        document.body.classList.remove("overflow-hidden");
        if (scrollToView) scrollToView(el);
    };

    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classNames(
                    "flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden",
                    "ease-in-out transition-all flex items-end duration-300 z-30",
                    { invisible: !visible },
                    { visible: visible },
                    { "translate-x-full": !visible },
                    { "translate-x-0": visible }
                )}
            >
                <div
                    ref={wrapperRef}
                    className="flex-1 w-[284px] min-h-0 bg-nao-bgModal"
                >
                    <div className="pt-[35px] px-5 flex justify-end">
                        <img
                            className="cursor-pointer select-none"
                            onClick={onClose}
                            src={getS3Url("/images/nao/ic_close.png")}
                            height="18"
                            width="18"
                            alt=""
                        />
                    </div>
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between h-[calc(100%-65px)] overflow-y-auto">
                        <div className="text-[1.25rem] font-medium text-nao-text space-y-11 text-center">
                            {category.map((item) => (
                                <div
                                    key={item.label}
                                    onClick={() => _scrollToView(item)}
                                    className="cursor-pointer leading-8"
                                >
                                    {t(`nao:${item.label}`)}
                                </div>
                            ))}
                            <div className="flex items-center select-none gap-2 justify-center">
                                <Language
                                    className="m-0 !text-sm"
                                    onClick={() =>
                                        language !== LANGUAGE_TAG.VI &&
                                        onChangeLang()
                                    }
                                    active={language === LANGUAGE_TAG.VI}
                                >
                                    VI
                                </Language>
                                <Language
                                    className="m-0 !text-sm"
                                    onClick={() =>
                                        language !== LANGUAGE_TAG.EN &&
                                        onChangeLang()
                                    }
                                    active={language === LANGUAGE_TAG.EN}
                                >
                                    EN
                                </Language>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <Divider className="w-full !mb-8" />
                            <div className="flex items-center pb-[18px]">
                                <img
                                    alt=""
                                    src={getS3Url("/images/nao/ic_onus.png")}
                                    height="32"
                                    width="32"
                                />
                                <div className="text-nao-text text-xs font-semibold ml-2">
                                    {t("nao:nao_token:get_buy_now")}
                                </div>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <img
                                    onClick={() => onDownload("app_store")}
                                    alt=""
                                    src={getS3Url(
                                        "/images/nao/ic_app_store.png"
                                    )}
                                    className="min-h-[35px] cursor-pointer"
                                    width="107"
                                />
                                <img
                                    onClick={() => onDownload("google_play")}
                                    alt=""
                                    src={getS3Url(
                                        "/images/nao/ic_google_play.png"
                                    )}
                                    className="min-h-[35px] cursor-pointer"
                                    width="117"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

const Language = styled.div.attrs({
    className:
        "px-3 text-xs py-[3px] md:py-[1px] md:px-4 md:text-sm rounded-[4px] cursor-pointer text-nao-white  font-semibold nao:leading-[26px]",
})`
    background: ${({ active }) => (active ? colors.nao.blue2 : "")};
`;

export default NaoHeader;
