import { Switch } from '@headlessui/react';
import React, { useState } from 'react';

const ToggleAsset = ({ assetName, handleAddNewAssets, isActive }) => {
    const [enabled, setEnabled] = useState(!!isActive);

    const handleToggleAsset = (value) => {
        if (handleAddNewAssets && typeof handleAddNewAssets === 'function') {
            handleAddNewAssets(assetName);
        }
        setEnabled(value);
    };

    return (
        <Switch
            checked={enabled}
            onChange={handleToggleAsset}
            className={`${enabled ? 'bg-violet-700' : 'bg-[#E1E2ED]'}
        relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
            />
        </Switch>
    );
};

export default React.memo(ToggleAsset);
