import { Search, X } from 'react-feather';

const SearchBox = ({ wrapperStyles = '', inputStyles = '', useClearBtn = false, onClear, inputProps }) => {

    return (
        <div className={'py-2 px-5 min-w-[120px] flex items-center rounded-lg bg-gray-5 dark:bg-darkBlue-3 ' + wrapperStyles}>
            <Search size={16} className="text-txtSecondary dark:text-txtSecondary-dark"/>
            <input className={'w-full px-3 font-medium text-sm ' + inputStyles} {...inputProps}/>
            <X size={16} className={useClearBtn ? 'cursor-pointer' : 'invisible cursor-pointer'}
               onClick={() => useClearBtn && onClear && onClear()}/>
        </div>
    )
}

export default SearchBox
