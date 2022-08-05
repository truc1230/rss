import React from 'react';
import { getS3Url } from 'redux/actions/utils';

const Indicators = ({ setCollapse, collapse, setMainIndicator, mainIndicator, setSubIndicator, subIndicator }) => {
    const mainIndicators = ['MA', 'EMA', 'BOLL'];
    const subIndicators = ['VOL', 'MACD', 'RSI', 'KDJ']

    const setIndicator = (item, key) => {
        let value = '';
        if (key === 'main') {
            value = mainIndicator === item ? '' : item;
            setMainIndicator(value)
        } else {
            value = subIndicator === item ? '' : item;
            setSubIndicator(value)
        }
    }

    const onCollapse = () => {
        setTimeout(() => {
            setCollapse(!collapse)
        }, 300);
    }

    return (
        <div className='h-[38px] flex items-center justify-between px-[10px] border-b border-t border-gray-4 dark:border-divider-dark'>
            <div className='flex items-center text-xs text-gray-1 dark:text-txtSecondary-dark font-medium justify-around w-full mr-[10px]'>
                {mainIndicators.map(item => (
                    <div
                        className={mainIndicator === item ? 'text-teal' : ''}
                        onClick={() => setIndicator(item, 'main')}>{item}</div>
                ))}
                |
                {subIndicators.map(item => (
                    <div className={subIndicator === item ? 'text-teal' : ''}
                        onClick={() => setIndicator(item, 'sub')}>{item}</div>
                ))}
            </div>
            {setCollapse &&
                <img
                    onClick={onCollapse}
                    src={getS3Url(`/images/icon/ic_maximun${collapse ? '_active' : ''}.png`)}
                    height={24} width={24}
                />
            }
        </div>
    );
};





export default Indicators;