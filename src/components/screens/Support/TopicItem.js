const TopicItem = ({
    icon,
    title,
    description
}) => {
    return (
        <div className="w-full h-full min-w-full min-h-[92px] md:min-h-[150px] lg:min-h-[180px] xl:min-h-[206px] py-3 md:px-8  md:py-5 flex flex-col items-center md:items-start bg-gray-4 dark:bg-darkBlue-3 rounded-xl cursor-pointer hover:opacity-80">
            <div className="w-[24px] h-[24px] md:w-[48px] md:h-[48px] lg:w-[52px] lg:h-[52px] xl:w-[70px] xl:h-[70px]">
                {icon || null}
            </div>
            <div className="px-4 sm:px-0 text-sm md:text-[18px] text-center font-bold mt-2 md:mt-3.5">{title || '---'}</div>
            <div className="hidden md:block text-sm text-txtSecondary dark:text-txtSecondary-dark mt-2.5">
                {description}
            </div>
        </div>
    )
}

export default TopicItem
