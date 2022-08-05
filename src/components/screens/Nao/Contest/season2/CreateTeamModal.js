import React, { useState, useRef, useContext } from 'react';
import Modal from 'components/common/ReModal';
import { TextField, ButtonNao, Tooltip } from 'components/screens/Nao/NaoStyle';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import _ from 'lodash';
import classnames from 'classnames'
import { API_CONTEST_CHECK_MEMBER, API_CONTEST_UPLOAD, API_CONTEST_CREATE_GROUP } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { useMemo } from 'react';
import colors from 'styles/colors';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import { IconLoading } from 'components/common/Icons';
import useWindowSize from 'hooks/useWindowSize';

const initMember = {
    member1: '',
    member2: '',
    member3: ''
}
const CreateTeamModal = ({ isVisible, onClose, userData, onShowDetail }) => {
    const { t } = useTranslation();
    const { width } = useWindowSize()
    const context = useContext(AlertContext);
    const [errors, setErros] = useState({});
    const [avatar, setAvatar] = useState({ file: null, url: null });
    const [name, setName] = useState('');
    const fullname = useRef({})
    const [member, setMember] = useState(initMember)
    const oldData = useRef({});
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const isLoading = useRef(false);

    const onAddAvatar = () => {
        const el = document.querySelector('#avatar_team');
        if (el) el.click();
    }

    const onChangeAvatar = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];
        const size = Math.round((file?.size / 1024));
        if (size > 2048 | !file) {
            context.alertV2.show('warning', t(`error:futures:INVALID_IMAGE`))
        } else {
            if (file) {
                reader.onloadend = () => {
                    const item = {
                        file: file,
                        url: reader.result
                    }
                    setAvatar(item)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const timer = useRef(null)
    const onHandleChange = (e, key) => {
        const value = e.target.value;
        const name = e.target.name;
        switch (key) {
            case 'name':
                setName(String(value).trimStart().replace(/[&#,+()$~%.;_'":*?<>[\]\{}@`|\/\\^=-]/g, ''))
                break;
            case 'member':
                const _value = String(value).trim().replace(/[^0-9]/g, '');
                isLoading.current = true;
                setMember({ ...member, [name]: _value });
                clearTimeout(timer.current)
                timer.current = setTimeout(() => {
                    e.target.blur();
                }, 1000);
                break;
            default:
                break;
        }

    }

    const checkDup = (value, name) => {
        return Object.keys(member).find(rs => value === member[rs] && rs !== String(name) || value === userData?.onus_user_id);
    }

    const onBlur = async (e) => {
        const value = e.target.value;
        const name = e.target.name;
        if (value === oldData.current[name]) return;
        oldData.current[name] = value;
        const _errors = { ...errors };
        _errors[name] = { error: false, message: '', duplicate: false }
        // if (value.length <= 20 && value) {
        //     delete fullname.current[name]
        //     _errors[name]['error'] = true;
        //     _errors[name]['message'] = t('nao:contest:invalid_id')
        // } else {
        if (value) {
            await checkMember(value, (data) => {
                if (data?.name) {
                    Object.keys(_errors).map(key => {
                        if (_errors[key]['duplicate']) {
                            if (!checkDup(member[key], key)) {
                                _errors[key]['duplicate'] = false;
                                _errors[key]['error'] = false;
                            }
                        }
                    })
                    fullname.current[name] = data?.name;
                    if (checkDup(value, name)) {
                        _errors[name]['duplicate'] = true;
                        _errors[name]['error'] = true;
                        _errors[name]['message'] = t('error:futures:DUPLICATED_USER');
                    } else {
                        _errors[name]['message'] = !data?.result ? t('nao:contest:invalid_member') : '';
                        _errors[name]['error'] = !data?.result;
                    }
                } else {
                    _errors[name]['error'] = true;
                    _errors[name]['message'] = t('nao:contest:invalid_id');
                    delete fullname.current[name]
                }
            });
        } else {
            delete fullname.current[name]
            delete _errors[name]
        }
        // }
        isLoading.current = false
        setErros(_errors)
    }

    const checkMember = async (id, cb) => {
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_CHECK_MEMBER,
                options: { method: 'GET' },
                params: { contest_id: 5, onus_user_id: id },
            });
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data)
            }
        } catch (e) {
            console.error('__ error', e);
        } finally {
        }
    };

    const upload = async (file) => {
        const formData = new FormData();
        formData?.append('image', file);
        setLoading(true);
        // return 'https://nami-dev.sgp1.digitaloceanspaces.com/upload/avatar/18-6Q0PLSxbtNTC.jpeg'
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_UPLOAD,
                options: { method: 'POST' },
                params: formData,
            });
            if (status === ApiStatus.SUCCESS) {
                return data?.avatar
            }
            context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`));
        } catch (e) {
            console.error('__ error', e);
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async () => {
        if (disabled || loading) return;
        let _avatar = null;
        if (avatar.file) {
            _avatar = await upload(avatar.file)
            if (!_avatar) return;
        }
        const params = {
            avatar: _avatar,
            leader_name: userData?.name,
            name: name.toUpperCase(),
            list_member_id: Object.keys(member).map(rs => member[rs]),
            contest_id: 5
        }
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_CREATE_GROUP,
                options: { method: 'POST' },
                params: params,
            });
            if (status === ApiStatus.SUCCESS) {
                onClose(true);
                context.alertV2.show('success', t('nao:contest:team_successfully'), null, null,
                    () => { onShowDetail({ displaying_id: data?.group_displaying_id, is_leader: 1, ...data }) },
                    null,
                    { confirmTitle: t('nao:contest:team_details') });
            } else {
                context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`));
            }
        } catch (e) {
            console.error('__ error', e);
        } finally {
            setLoading(false);
        }

    }

    const disabled = useMemo(() => {
        return !name || Object.keys(member).find(rs => !member[rs]) || Object.keys(errors).find(e => errors[e]?.['error'])
    }, [member, name, avatar, errors])

    const isMobile = width <= 640;

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={() => onClose()}
            onusClassName={`${isMobile ? '!px-2 pb-[3.75rem]' : '!px-8 !py-10 max-w-[484px]'} !bg-nao-tooltip !overflow-hidden`}
            containerClassName="!bg-nao-bgModal2/[0.9]"
            center={!isMobile}
        >
            <div className="!px-4 text-2xl leading-8 font-semibold">{t('nao:contest:create_a_team')}</div>
            <div className="!px-4 scrollbar-nao form-team mt-8 overflow-y-auto max-h-[calc(100%-136px)]">
                <div>
                    <div className="text-sm font-medium leading-6">{t('nao:contest:team_information')}</div>
                    <div className="mt-4 flex items-center justify-between space-x-4">
                        <div onClick={onAddAvatar}
                            style={{ backgroundImage: avatar?.url ? `url(${avatar.url})` : null }}
                            className={classnames(
                                `min-h-[58px] min-w-[58px] rounded-[50%] bg-onus flex flex-col items-center justify-center`,
                                'bg-center bg-cover cursor-pointer',
                                {
                                    'border-[1px] border-dashed border-nao-blue2': !avatar.url,
                                    'bg-origin-padding': avatar.url,
                                },
                            )}>
                            {!avatar.url && <>
                                <div className="mt-[7px]"> <UploadIcon /></div>
                                <span className="text-[11px] leading-6">{t('nao:contest:add')}</span>
                            </>
                            }
                        </div>
                        <TextField className="uppercase" value={name} maxLength={20} label={t('nao:contest:invalid_name')} onChange={(e) => onHandleChange(e, 'name')} />
                        <input type="file" id="avatar_team" className='hidden' accept="image/*" onChange={onChangeAvatar} />
                    </div>
                </div>
                <div className="mt-8">
                    <Tooltip className="!p-[10px] sm:min-w-[282px] sm:!max-w-[282px]"
                        backgroundColor={colors.nao.tooltip2} arrowColor="transparent" id="tooltip-list-team" >
                        <div className="font-medium text-sm text-nao-grey2 "  >
                            {t('nao:contest:tooltip_create_team')}
                        </div>
                    </Tooltip>
                    <div className="text-sm font-medium leading-6 flex items-center space-x-2">
                        <span>{t('nao:contest:member_list')}</span>
                        <img data-tip={''} data-for="tooltip-list-team" className="cursor-pointer" src={getS3Url('/images/nao/ic_info.png')} width="16" height="16" alt="" />
                    </div>
                    <div className="flex flex-col space-y-4 mt-4">
                        <TextField label={t('nao:contest:captain_id')} value={userData?.onus_user_id} prefix={userData?.name} readOnly />
                        {Object.keys(initMember).map((m, idx) => (
                            <TextField key={idx}
                                label={t(`nao:contest:id_member`, { value: idx + 1 })}
                                error={errors?.[m]?.['error']} helperText={errors?.[m]?.['message']}
                                onBlur={onBlur}
                                value={member[m]} prefix={fullname.current[m]} name={m}
                                onChange={(e) => onHandleChange(e, 'member')} />
                        ))}
                    </div>
                </div>
            </div>
            <div className='!px-4 flex items-center space-x-4 mt-8'>
                <ButtonNao onClick={() => onClose()} border className="w-full !rounded-md">{t('common:close')}</ButtonNao>
                <ButtonNao onClick={onSubmit} disabled={disabled || loading || isLoading.current} className="w-full !rounded-md">
                    {loading && <IconLoading className="!m-0" color={colors.nao.grey} />} {t('nao:contest:create_team')}
                </ButtonNao>
            </div>
        </Modal>
    );
};

const UploadIcon = () => {
    return <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 2C8.23858 2 6 4.23858 6 7C6 7.55228 5.55228 8 5 8C3.21354 8 2 9.24054 2 10.5C2 11.7595 3.21354 13 5 13C5.55229 13 6 13.4477 6 14C6 14.5523 5.55229 15 5 15C2.36818 15 0 13.1065 0 10.5C0 8.20892 1.82965 6.46876 4.05977 6.08111C4.50974 2.64936 7.44547 0 11 0C14.5545 0 17.4903 2.64936 17.9402 6.08111C20.1703 6.46876 22 8.20892 22 10.5C22 13.1065 19.6318 15 17 15C16.4477 15 16 14.5523 16 14C16 13.4477 16.4477 13 17 13C18.7865 13 20 11.7595 20 10.5C20 9.24054 18.7865 8 17 8C16.4477 8 16 7.55228 16 7C16 4.23858 13.7614 2 11 2Z" fill="#49E8D5" />
        <path d="M14.7071 11.7071C14.3166 12.0976 13.6834 12.0976 13.2929 11.7071L12 10.4142V19C12 19.5523 11.5523 20 11 20C10.4477 20 10 19.5523 10 19V10.4142L8.70711 11.7071C8.31658 12.0976 7.68342 12.0976 7.29289 11.7071C6.90237 11.3166 6.90237 10.6834 7.29289 10.2929L10.2929 7.29289C10.4804 7.10536 10.7348 7 11 7C11.2652 7 11.5196 7.10536 11.7071 7.29289L14.7071 10.2929C15.0976 10.6834 15.0976 11.3166 14.7071 11.7071Z" fill="#49E8D5" />
    </svg>

}

export default CreateTeamModal;