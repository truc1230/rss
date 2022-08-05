import React, { useRef, useState, useContext } from 'react';
import Modal from 'components/common/ReModal';
import { TextField, ButtonNao } from 'components/screens/Nao/NaoStyle';
import { IconLoading } from 'components/common/Icons';
import { useTranslation } from 'next-i18next';
import colors from 'styles/colors';
import { API_CONTEST_CHECK_MEMBER, API_CONTEST_SEND_INVITE } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import useWindowSize from 'hooks/useWindowSize';

const AddMemberModal = ({ onClose }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const [member, setMember] = useState('');
    const fullname = useRef('')
    const [error, setError] = useState({ error: false, message: '' })
    const timer = useRef(null)
    const oldData = useRef(null);
    const { width } = useWindowSize()

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

    const onHandleChange = (e) => {
        const value = String(e.target.value).trim().replace(/[^0-9]/g, '');
        setMember(value);
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            e.target.blur();
        }, 1000);
    }

    const onBlur = async (e) => {
        const value = e.target.value;
        if (value === oldData.current) return;
        oldData.current = value;
        const _error = { ...error };
        if (value) {
            await checkMember(value, (data) => {
                if (data?.name) {
                    fullname.current = data?.name;
                    _error.message = !data?.result ? t('nao:contest:invalid_member') : '';
                    _error.error = !data?.result;
                } else {
                    _error.error = true;
                    _error.message = t('nao:contest:invalid_id');
                    fullname.current = ''
                }
            });
        } else {
            fullname.current = ''
            _error.error = false
        }
        setError(_error)
    }

    const onAddMember = async () => {
        if (disabled) return;
        setLoading(true)
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_SEND_INVITE,
                options: { method: 'POST' },
                params: { contest_id: 5, invite_onus_user_id: member },
            });
            if (status === ApiStatus.SUCCESS) {
                context.alertV2.show('success', t('nao:contest:member_successfully'), null, null, null, () => {
                    onClose(data)
                });
            } else {
                context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`));
            }
        } catch (e) {
            console.error('__ error', e);
        } finally {
            setLoading(false)
        }
    }

    const disabled = loading || error.error || !member || !fullname.current
    const isMobile = width <= 640;

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={() => onClose()}
            onusClassName={`${isMobile ? '!px-6 pb-[3.75rem]' : '!p-8 max-w-[564px]'}  !bg-nao-tooltip !overflow-hidden`}
            containerClassName="!bg-nao-bgModal2/[0.9]"
            center={!isMobile}
        >
            <div className="text-2xl font-semibold leading-8 mb-6">{t('nao:contest:add_member')}</div>
            <TextField onBlur={onBlur} label={t('nao:contest:id_member')} value={member} prefix={fullname.current}
                error={error.error} helperText={error.message} onChange={onHandleChange} />
            <div className='flex items-center space-x-4 mt-6'>
                <ButtonNao onClick={() => onClose()} border className="w-full !rounded-md">{t('common:close')}</ButtonNao>
                <ButtonNao onClick={onAddMember} disabled={disabled} className="w-full !rounded-md">
                    {loading && <IconLoading className="!m-0" color={colors.nao.grey} />} {t('nao:contest:add_member')}
                </ButtonNao>
            </div>
        </Modal>
    );
};

export default AddMemberModal;