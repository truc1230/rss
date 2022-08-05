import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { createPopper } from '@popperjs/core';
import debounce from 'lodash/debounce';
import { getNotifications, markAllAsRead, truncateNotifications } from 'src/redux/actions/notification';
import { NotificationStatus } from 'src/redux/actions/const';
import { getTimeAgo } from 'src/redux/actions/utils';
import { IconBell, Notification } from '../common/Icons';
import colors from 'styles/colors';

const NotificationList = ({ btnClass = '', navTheme = null }) => {
    const { t } = useTranslation(['navbar']);
    const dispatch = useDispatch();
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();

    const truncateNotificationsDebounce = debounce(() => {
        dispatch(truncateNotifications());
    }, 60000);

    const notificationsMix = useSelector(state => state.notification.notificationsMix);
    const hasNextNotification = useSelector(state => state.notification.hasNextNotification);
    const unreadCount = useSelector(state => state.notification.unreadCount);

    const [notificationLoading, setNotificationLoading] = useState(false);

    const markAsRead = async () => {
        try {
            if (!notificationsMix) return;
            const ids = notificationsMix.reduce((prev, curr) => {
                if (curr.status === NotificationStatus.READ) return prev;

                prev.push(curr.id);
                return prev;
            }, []);

            dispatch(await markAllAsRead(ids));
        } catch (er) {
            // console.error(er);
        }
    };

    const fetchNotificationsOnOpen = _.throttle(() => dispatch(getNotifications()), 1000);

    const loadMoreNotification = () => {
        let prevId;
        if (notificationsMix && notificationsMix.length) {
            prevId = notificationsMix[notificationsMix.length - 1].id;
        }
        setNotificationLoading(true);
        dispatch(getNotifications(prevId, () => setNotificationLoading(false)));
    };

    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: 'bottom-start',
        });
        setDropdownPopoverShow(true);
        fetchNotificationsOnOpen();
    };
    const closeDropdownPopover = () => {
        if (dropdownPopoverShow) {
            markAsRead();
            truncateNotificationsDebounce();
            setDropdownPopoverShow(false);
        }
    };
    const handleClickOutside = e => {
        if (popoverDropdownRef.current.contains(e.target)) {
            return;
        }
        // outside click
        closeDropdownPopover();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popoverDropdownRef]);

    let content;
    const mix = notificationsMix;
    // setNotification
    if (mix === null) {
        content = <div className="w-full h-full text-center py-4">{t('navbar:loading')}...</div>;
    } else if (Array.isArray(mix)) {
        if (mix.length) {
            content = (
                <>
                    {/* { this._renderNotificationHeader(<Translate id="noti_game.noti_status_unread"/>)} */}
                    {/* { mix.map(notification => this._renderNotificationItem(notification)) } */}
                    {mix.map(notification => (
                        <div
                            className={`py-2.5 flex justify-between group hover:bg-teal-5 cursor-pointer ${notification?.status === NotificationStatus.READ ? '' : 'bg-black-5'}`}
                            key={notification?.id || notification?.created_at}
                        >
                            <div className="mr-3">
                                <Notification />
                            </div>
                            <div className="flex-grow">
                                <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark mb-1.5 line-clamp-2">
                                    {notification.content}
                                </div>
                                <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                    {getTimeAgo(notification.created_at)}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            );
        }
        if (!content) {
            content = <div className="w-full h-full text-center py-4">{t('navbar:no_noti')}</div>;
        }
    }
    return (
        <>
            <div className="relative">
                <button
                    type="button"
                    className={`btn btn-clean btn-icon inline-flex items-center focus:outline-none relative mr-6 ${btnClass}`}
                    aria-expanded="false"
                    ref={btnDropdownRef}
                    onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        dropdownPopoverShow
                            ? closeDropdownPopover()
                            : openDropdownPopover();
                    }}
                >
                    <IconBell color={navTheme ? navTheme.color : colors.grey4}/>
                    {unreadCount > 0
                    && (
                        <div
                            className="absolute w-2.5 h-2.5 rounded-full flex items-center justify-center bg-red text-white text-[8px] top-2 right-2	"
                        >{unreadCount}
                        </div>
                    )}

                </button>

                <div
                    ref={popoverDropdownRef}
                    className={
                        (dropdownPopoverShow ? 'block ' : 'hidden ')
                        + 'absolute z-10 transform w-screen max-w-[415px] rounded  right-0 bg-bgPrimary dark:bg-bgPrimary-dark shadow-lg text-sm'
                    }
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:noti')}</div>
                            {unreadCount > 0 && <div className="text-sm font-medium text-teal dark:text-teal">{unreadCount} {t('navbar:unread_noti')}</div>}
                        </div>
                        <div className="max-h-[488px]  min-h-[400px] overflow-y-auto">
                            {content}
                        </div>

                        <div className="font-medium">

                            <div className="flex items-center justify-center">
                                {
                                    hasNextNotification
                                        ?
                                        (
                                            <>
                                                {
                                                    notificationLoading ?
                                                        <span className="text-txtPrimary dark:text-txtPrimary-dark hover:text-teal cursor-pointer">
                                                            {t('loading')}
                                                        </span>
                                                        : (
                                                            <span
                                                                onClick={loadMoreNotification}
                                                                className="text-txtPrimary dark:text-txtPrimary-dark hover:text-teal cursor-pointer"
                                                            >
                                                                {t('load_more')}
                                                            </span>
                                                        )
                                                }
                                            </>
                                        )
                                        :
                                        (
                                            <span className="text-txtPrimary dark:text-txtPrimary-dark hover:text-teal cursor-pointer">
                                                {t('navbar:read_all_noti')}
                                            </span>
                                        )
                                }

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationList;
