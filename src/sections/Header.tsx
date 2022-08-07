import React from 'react';
import Button from '../components/Button';
import { CarretDown } from '../components/Svg';

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
            <div className="flex items-center gap-6">
                {/* en-vi */}
                <div className="flex items-center border border-redPrimary p-1 rounded-[3px] gap-1">
                    <Button
                        variants="gradient"
                        className="!p-[6px] rounded-[4px] text-sm leading-[14px]"
                    >
                        VI
                    </Button>
                    <div className="text-sm font-medium mx-[6px]">EN</div>
                </div>
                <Button variants="gradient" className="text-sm leading-[14px] w-[107px] h-[38px]">
                    ketnoivi
                </Button>
            </div>
        </div>
    );
};

export default Header;
