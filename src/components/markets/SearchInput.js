import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { IconSearch } from 'src/components/common/Icons';

const SearchInput = ({
    placeholder,
    customStyle,
    handleFilterCategoryList,
    handleFilterAssetsList,
    customWrapperStyle,
    parentState,
}) => {
    const [debouncedValue, setDebouncedValue] = useState('');
    const [queryFilter, setQueryFilter] = useState('');

    useDebounce(
        () => {
            setDebouncedValue(queryFilter);
        },
        600,
        [queryFilter],
    );

    useEffect(() => {
        if (
            handleFilterCategoryList &&
            typeof handleFilterCategoryList === 'function'
        ) {
            handleFilterCategoryList(debouncedValue);
        }
        if (
            handleFilterAssetsList &&
            typeof handleFilterAssetsList === 'function'
        ) {
            handleFilterAssetsList(debouncedValue);
        }
    }, [debouncedValue]);

    return (
        <div className="form-group" style={customWrapperStyle}>
            <div className="input-group border-divider dark:border-divider-dark bg-bgInput dark:bg-bgInput-dark">
                <div className="input-group-append px-2 flex-shrink-0 flex justify-end items-center">
                    <span className="input-group-text text-txtSecondary">
                        <IconSearch />
                    </span>
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={({ currentTarget }) => {
                        setQueryFilter(currentTarget.value);
                        parentState && parentState(currentTarget.value);
                    }}
                    value={queryFilter}
                    className="form-control form-control-sm bg-transparent font-medium text-txtPrimary dark:text-txtPrimary-dark"
                    style={customStyle}
                />
            </div>
        </div>
    );
};

export default SearchInput;
