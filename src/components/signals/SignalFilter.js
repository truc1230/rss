/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { getS3Url } from 'redux/actions/utils';
import { useComponentVisible } from 'utils/customHooks';

const { IconClose, IconCustomCheckbox } = require('src/components/common/Icons');

const SignalFilterWrapper = ({ templates, filteredTemplates, toggleFilter, selectFilter, setCurrentSignalPage }) => {
    const { isComponentVisible, setIsComponentVisible } = useComponentVisible(true);

    useEffect(() => {
        if (!isComponentVisible) {
            setTimeout(toggleFilter, 200);
        }

        return clearTimeout(toggleFilter, 200);
    }, [isComponentVisible]);

    return <SignalFilter
        templates={templates}
        isComponentVisible={isComponentVisible}
        setIsComponentVisible={setIsComponentVisible}
        selectFilter={selectFilter}
        filteredTemplates={filteredTemplates}
        setCurrentSignalPage={setCurrentSignalPage}
    />;
};

const SignalFilter = ({ templates, filteredTemplates, isComponentVisible, setIsComponentVisible, selectFilter, setCurrentSignalPage }) => {
    const { t, i18n } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        setTimeout(setIsShow(isComponentVisible), 200);
        return clearTimeout(setIsShow(isComponentVisible), 200);
    }, [isComponentVisible]);

    useEffect(() => {
        if (filteredTemplates?.length > 0) {
            const category = [];
            filteredTemplates.forEach(template => category.push(template?.category));
            setSelectedCategory(category);
        }
    }, [filteredTemplates]);

    const handleFilter = (filter) => {
        if (selectedCategory.length === 0) {
            return setSelectedCategory([filter?.category]);
        }
        if (selectedCategory.includes(filter?.category)) {
            return setSelectedCategory(selectedCategory.filter(category => category !== filter?.category));
        }
        return setSelectedCategory([...selectedCategory, filter?.category]);
    };

    const handleClose = () => {
        setIsComponentVisible(false);
    };

    const submitFilter = async () => {
        await selectFilter(selectedCategory);
        handleClose();
    };

    const resetFilter = async () => {
        if (templates?.length > 0) {
            const category = [];
            await templates.forEach(template => category.push(template?.category));
            setSelectedCategory(category);
            await selectFilter(category);
            await setCurrentSignalPage(1);
            handleClose();
        }
    };

    const selectAllFilter = async () => {
        if (templates?.length > 0) {
            const category = [];
            await templates.forEach(template => category.push(template?.category));
            setSelectedCategory(category);
        }
    };

    const unSelectAllFilter = () => {
        setSelectedCategory([]);
    };

    return (
        <Transition
            as="div"
            show={isShow}
            enter="transform transition duration-[300ms]"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform duration-400 transition ease-in-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
        >
            <div className="bg-white rounded-[12px] max-w-xs sm:max-w-none px-6 pt-8 pb-6 w-96" style={{ boxShadow: '0px 24px 40px rgba(2, 8, 61, 0.12)' }}>
                <div className="flex items-center justify-between">
                    <p className="font-bold text-xl">{t('signals:signal_filter')}</p>
                    <button
                        type="button"
                        onClick={() => {
                            if (selectedCategory.length < templates.length) {
                                selectAllFilter();
                            }
                            return unSelectAllFilter();
                        }}
                        className="text-[#00C8BC] text-sm font-bold"
                    >
                        {selectedCategory.length < templates.length ? t('signals:select_all_filter') : t('signals:unselect_all_filter')}
                    </button>
                </div>
                <ul className="w-full">
                    {
                        templates.map((template, index) => (
                            <li
                                className="flex items-center"
                                key={template?._id}
                            >
                                <div className="w-6 h-6 min-w-6 p-1 rounded-[3px] mr-[10px]" style={{ backgroundColor: template?.backgroundColor ?? '#CBE0FF' }}>
                                    <img src={getS3Url(template?.s3LogoUrl)} alt="logo" className="w-full object-cover" />
                                </div>
                                <div
                                    className={`flex items-center justify-between w-full ${index !== templates.length - 1 ? 'border-b' : 'border-none'} border-[#EEF2FA]`}
                                >
                                    <p style={{ fontWeight: 500 }} className="py-4 mr-3 text-left">{template?.name[i18n.language]}</p>
                                    <div className="flex items-center min-w-6 relative">
                                        <input
                                            type="checkbox"
                                            name={template?.category}
                                            value={template?.category}
                                            checked={selectedCategory.includes(template?.category)}
                                            onChange={() => handleFilter(template)}
                                            className="appearance-none cursor-pointer h-6 w-6 border border-[#C5C6D2] rounded checked:bg-[#00C8BC] checked:border-transparent focus:outline-none"
                                        />
                                        <div className="absolute inset-2 left-[7px] pointer-events-none"><IconCustomCheckbox /></div>
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div className="flex items-center justify-between mt-4">
                    <button
                        type="button"
                        className="flex-1 py-3 bg-[#F7F6FD] rounded font-bold"
                        onClick={() => resetFilter()}
                    >{t('signals:cancel_filter')}
                    </button>
                    <button
                        type="button"
                        className="flex-1 py-3 bg-[#00C8BC] rounded font-bold text-white ml-2 disabled:bg-[#9F90E7] disabled:cursor-not-allowed focus:bg-[#2A11AC] hover:bg-[#4822FA]"
                        onClick={() => submitFilter()}
                        disabled={selectedCategory.length === 0}
                    >{t('signals:apply_filter')}
                    </button>
                </div>
            </div>
        </Transition>
    );
};

export default SignalFilterWrapper;
