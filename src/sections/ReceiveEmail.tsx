import React, { useState } from 'react';
import Button from '../components/Button';
import * as yup from 'yup';

type Props = {};

export default function ReceiveEmail({}: Props) {
    const [email, setEmail] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const emailSchemaValidate = yup.string().email();
    async function handleSubmit() {
        try {
            await emailSchemaValidate.validate(email);
            console.log('object');
            // process here
        } catch (error) {
            setErrMessage(error.errors);
        }
    }
    return (
        <section className="bg_recieve_email w-full max-w-[1062px] mx-auto h-[320px] flex flex-col justify-center items-center">
            <div className="text-5xl leading-10 text-redPrimary mb-2">nhanthongbao</div>
            <div className="mb-6">
                Trở thành người đầu tiên nhận được các tin tức và sự kiện quan trọng.{' '}
            </div>
            <div className="flex items-center gap-2 border border-divider rounded-[3px] py-2 px-3 w-[500px] bg-white">
                <input
                    className="flex-1"
                    type="text"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="nhapdiachiemail"
                />
                <Button
                    variants="gradient"
                    className="text-sm w-[135px] h-[38px]"
                    onClick={handleSubmit}
                >
                    dangkyngay
                </Button>
            </div>
            {errMessage && <div>{errMessage}</div>}
        </section>
    );
}
