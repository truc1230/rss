import React from 'react';
import Skeletor from 'components/common/Skeletor';

const OrderDetailLoading = () => {
    return (
        <div className="min-h-screen bg-onus">
            <div className="flex flex-col items-center pt-2">
                <Skeletor onusMode width={100} height={15} />
                <Skeletor onusMode width={100} height={10} />
            </div>
            <div>
                <Skeletor onusMode width={'100%'} height={400} />
            </div>
            <div className="mt-5 px-[16px]">
                <div className="py-[10px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex flex-col">
                                <div className="flex">
                                    <Skeletor onusMode width={100} height={21} />
                                </div>
                                <div className="flex">
                                    <Skeletor onusMode width={50} height={10} />&nbsp;&nbsp;
                                    <Skeletor onusMode width={50} height={10} />
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div>
                                <Skeletor onusMode width={80} height={8} />
                                <Skeletor onusMode width={80} height={8} />
                            </div>
                            <div className="ml-[16px]"> <Skeletor onusMode width={30} height={30} /></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap mt-[5px]">
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                        <div className="w-[48%]"> <Skeletor onusMode width={'100%'} height={10} /></div>
                    </div>
                    <div className="h-[1px]"> <Skeletor onusMode width={'100%'} height={1} className="mt-[15px]" /></div>
                </div>
            </div>
            <div className="mt-5 px-[16px]">
                <Skeletor onusMode width={200} height={20} />
                <div className="flex justify-between my-[12px]">
                    <Skeletor onusMode width={100} height={10} />
                    <Skeletor onusMode width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor onusMode width={100} height={10} />
                    <Skeletor onusMode width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor onusMode width={100} height={10} />
                    <Skeletor onusMode width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor onusMode width={100} height={10} />
                    <Skeletor onusMode width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor onusMode width={100} height={10} />
                    <Skeletor onusMode width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor onusMode width={100} height={10} />
                    <Skeletor onusMode width={100} height={10} />
                </div>
                <div className="flex justify-between my-[12px]">
                    <Skeletor onusMode width={100} height={10} />
                    <Skeletor onusMode width={100} height={10} />
                </div>
            </div>
        </div>
    );
};

export default OrderDetailLoading;