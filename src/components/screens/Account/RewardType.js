import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {
    formatNumber,
    formatTime,
    getLoginUrl,
    getS3Url,
    formatCurrency,
} from "redux/actions/utils";

import RewardButton, {
    REWARD_BUTTON_STATUS,
} from "components/screens/Account/RewardButton";
import useIsFirstRender from "hooks/useIsFirstRender";
import { BREAK_POINTS } from "constants/constants";
import useWindowSize from "hooks/useWindowSize";
import { useSelector } from "react-redux";
import Types from "./types";
import { PulseLoader } from "react-spinners";
import colors from "styles/colors";

const RewardType = memo(
    ({ data, active, assetConfig, claim, claiming, onClaim }) => {
        // Init state
        const [reachedProgress, setReachedProgress] = useState(0);

        const auth = useSelector((state) => state.auth?.user) || null;

        // Use hooks
        const {
            t,
            i18n: { language },
        } = useTranslation();
        const isFirst = useIsFirstRender();
        const { width } = useWindowSize();

        // Render Handler
        const renderContent = useCallback(() => {
            const condition = data?.condition;
            if (!auth) return null;

            switch (condition) {
                case Types.TASK_CONDITION.SINGLE_MISSION:
                    const currentStep =
                        data?.user_metadata?.status ||
                        Types.TASK_HISTORY_STATUS.PENDING;

                    let text = "";
                    let textClass = "";
                    let stepIcon = null;

                    if (currentStep === Types.TASK_HISTORY_STATUS.PENDING) {
                        text = t("common:incomplete");
                        textClass = "text-yellow";
                        stepIcon = "/images/icon/warning.png";
                    } else if (
                        currentStep === Types.TASK_HISTORY_STATUS.FINISHED
                    ) {
                        text = t("common:completed");
                        textClass = "text-dominant";
                        stepIcon = "/images/icon/success.png";
                    }

                    return (
                        <div
                            style={
                                width >= BREAK_POINTS.lg
                                    ? { width: "calc(100% - 250px)" }
                                    : undefined
                            }
                            className="mt-3 mb-4 text-xs sm:text-sm"
                        >
                            <div className={"flex items-center " + textClass}>
                                {stepIcon && (
                                    <img
                                        src={getS3Url(stepIcon)}
                                        className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] mr-1.5"
                                        alt={null}
                                    />
                                )}
                                <span>{text}</span>
                            </div>
                            <div className="w-full mt-1.5 text-xs lg:text-sm">
                                ({t("common:end_at")}{" "}
                                {formatTime(data?.ended_at, "HH:mm dd-MM-yyyy")}
                                )
                            </div>
                        </div>
                    );
                case Types.TASK_CONDITION.PROGRESS:
                    let reached = data?.user_metadata?.metadata?.value || 0;
                    let target = data?.metadata?.target;

                    if (reached > target)
                        target = Math.ceil(reached / target) * target;
                    return (
                        <div className="my-4 w-full xl:min-w-[40%] font-medium">
                            <div className="flex items-center">
                                <div className="w-1/2 sm:w-2/3 md:w-3/4 lg:w-1/2 relative rounded-lg overflow-hidden h-[3.65px] lg:h-[5px] xl:h-[8px] bg-teal-lightTeal dark:bg-teal-opacity">
                                    <div
                                        style={{ width: reachedProgress + "%" }}
                                        className="absolute h-full top-0 left-0 bg-dominant rounded-lg transition-all duration-200 ease-in"
                                    />
                                </div>
                                <div className="flex text-right text-xs md:text-sm xl:text-[16px] xl:pr-0 ml-2">
                                    <span className="text-dominant">
                                        {formatCurrency(reached, 3)}
                                    </span>
                                    <span>/</span>
                                    <span className="break-normal">
                                        {formatCurrency(target, 3)}
                                    </span>
                                </div>
                                &nbsp;
                                <div className="text-xs md:text-sm xl:text-[16px] whitespace-nowrap	">
                                    (
                                    {(data?.user_metadata?.reward
                                        ?.num_of_rewards ?? 0) +
                                        " " +
                                        data?.reward?.unit[language]}
                                    )
                                </div>
                            </div>
                            <div className="w-full mt-1.5 text-xs lg:text-sm font-normal">
                                ({t("common:end_at")}{" "}
                                {formatTime(data?.ended_at, "HH:mm dd-MM-yyyy")}
                                )
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        }, [
            data?.condition,
            data?.metadata,
            data?.user_metadata,
            auth,
            reachedProgress,
            language,
            isFirst,
            width,
            assetConfig,
        ]);

        const renderButtonGroup = useCallback(() => {
            const buttonGroup = [];
            const current = Date.now();
            const isExpired = current > Date.parse(data?.ended_at);
            const isClaimed =
                data?.user_metadata?.claim_status ===
                Types.TASK_HISTORY_CLAIM_STATUS.CLAIMED;

            !isExpired &&
                !isClaimed &&
                data?.cta_button_url?.forEach((action, index) => {
                    // !TODO: Handle submit Task Action
                    const rewardProps = handleRewardButtonProps(action, {
                        ...data,
                        t,
                        language,
                    });

                    if (action?.type === Types.TASK_CTA_TYPE.URL) {
                        buttonGroup.push(
                            <RewardButton
                                key={`reward_button_${index}`}
                                title={rewardProps?.title}
                                status={rewardProps?.status}
                                href={rewardProps?.href}
                                componentType="a"
                                buttonStyles="w-[47%] max-w-[47%] sm:max-w-[120px] min-w-[90px] xl:w-[120px] mr-3"
                            />
                        );
                    }
                });

            const claimProps = {
                title: t("reward-center:claim"),
                status: REWARD_BUTTON_STATUS.NOT_AVAILABLE,
            };

            if (
                data?.user_metadata?.claim_status ===
                    Types.TASK_HISTORY_CLAIM_STATUS.PENDING &&
                data?.user_metadata?.status ===
                    Types.TASK_HISTORY_STATUS.FINISHED
            ) {
                claimProps.title = t("reward-center:claim");
                claimProps.status = REWARD_BUTTON_STATUS.AVAILABLE;
            } else if (isClaimed) {
                claimProps.title = t("reward-center:button_status.claimed");
                claimProps.status = REWARD_BUTTON_STATUS.NOT_AVAILABLE;
            }

            if (isExpired) {
                claimProps.title = t("reward-center:button_status.expired");
                claimProps.status = REWARD_BUTTON_STATUS.NOT_AVAILABLE;
            }

            buttonGroup.push(
                <RewardButton
                    key="reward_button_claim"
                    onClick={() =>
                        claimProps?.status === REWARD_BUTTON_STATUS.AVAILABLE &&
                        onClaim(data?.user_metadata?._id, {
                            reward: data?.reward,
                            assetConfig,
                            category: data?.category,
                        })
                    }
                    title={
                        claiming ? (
                            <PulseLoader size={3} color={colors.teal} />
                        ) : (
                            claimProps?.title
                        )
                    }
                    status={claimProps?.status}
                    buttonStyles="w-[47%] max-w-[47%] sm:max-w-[120px] min-w-[90px] xl:w-[120px]"
                />
            );

            return (
                <div className="flex items-center lg:justify-end ">
                    {!auth ? (
                        <RewardButton
                            title={t("common:sign_in")}
                            buttonStyles="mt-3 w-full min-w-[90px] sm:max-w-[120px]"
                            componentType="a"
                            href={getLoginUrl("sso", "login")}
                            status={REWARD_BUTTON_STATUS.AVAILABLE}
                        />
                    ) : (
                        buttonGroup
                    )}
                </div>
            );
        }, [data, auth, language, onClaim, claiming, claim, assetConfig]);

        useEffect(() => {
            let reached = data?.user_metadata?.metadata?.value || 0;
            let target = data?.metadata?.target;
            if (reached > target) target = Math.ceil(reached / target) * target;
            const progress = Math.floor((reached / target) * 100);

            if (active) {
                setTimeout(() => setReachedProgress(progress), 500);
            }
        }, [active, data?.metadata, data?.user_metadata]);

        return (
            <>
                {renderContent()}
                {renderButtonGroup()}
            </>
        );
    }
);

const handleRewardButtonProps = (action, payload) => {
    switch (action?.type) {
        case Types.TASK_CTA_TYPE.URL:
            return {
                title: action?.title?.[payload?.language],
                status: REWARD_BUTTON_STATUS.AVAILABLE,
                componentType: "a",
                href: action?.url || "/",
            };
        default:
            return {};
    }
};

export default RewardType;
