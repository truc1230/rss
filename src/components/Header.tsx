import React from 'react';
import Button from './Button';
import { CarretDown } from './Svg';

const Header = () => {
    return (
        <div className="flex items-center justify-between px-3 lg:px-10 h-[70px]">
            <div className="flex items-center">
                <img src="/images/logo_insurance.png" className="w-[75px] h-[36px]" alt="logo" />
                <div className="flex items-center font-medium gap-6 ml-12">
                    <div className="text-sm leading-[14px]">Trangchu</div>
                    <div>
                        <div className="flex items-center text-sm leading-[14px]">
                            muabaohiem
                            <CarretDown className="ml-[14px]" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <Button variants="primary">ketnoivi</Button>
            </div>
        </div>
    );
};

export default Header;
