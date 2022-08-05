import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { DOWNLOAD_APP_LINK } from 'src/redux/actions/const';

const DefaultMobileView = (props, ref) => {
    const { t } = useTranslation();
    return (
        <div className="inline-block py-8 w-full overflow-hidden text-left align-middle transition-all transform bg-white">
            <div className="text-sm">
                <div className="bg-blue-50">
                    <img
                        src={getS3Url(
                            "/images/screen/homepage/journey_graphics2.png"
                        )}
                        alt=""
                        className="mx-auto"
                    />
                </div>
                <div className="px-6 py-8 text-center !font-bold">
                    <div className="text-xl">
                        {t("landing:download_app_hint")}
                    </div>
                    <div className="text-xl text-teal mb-[30px]">
                        Nami Exchange
                    </div>
                    <div className="">
                        <a
                            href={DOWNLOAD_APP_LINK.IOS}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <button
                                className="btn btn-black w-full mb-2"
                                type="button"
                                rel="noreferrer"
                            >
                                {t("landing:download_app_hint_appstore")}
                            </button>
                        </a>
                        <a
                            href={DOWNLOAD_APP_LINK.ANDROID}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <button
                                className="btn btn-primary w-full"
                                type="button"
                            >
                                {t("landing:download_app_hint_googleplay")}
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultMobileView;
