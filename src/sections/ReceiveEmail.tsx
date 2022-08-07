import React from 'react';
import Button from '../components/Button';

type Props = {};

export default function ReceiveEmail({}: Props) {
    return (
        <section className="bg_recieve_email w-full md:my-[120px] max-w-[1062px] mx-auto h-[320px] flex flex-col justify-center items-center">
            <div className="text-5xl leading-10 text-redPrimary mb-2">nhanthongbao</div>
            <div className="mb-6">
                Trở thành người đầu tiên nhận được các tin tức và sự kiện quan trọng.{' '}
            </div>
            <div className="flex items-center gap-2 border border-devider rounded-[3px] py-2 px-3 w-[500px] bg-white">
                <input className="flex-1" type="text" placeholder="nhapdiachiemail" />
                <Button variants="gradient" className="text-sm w-[135px] h-[38px]">
                    dangkyngay
                </Button>
            </div>
        </section>
    );
}
