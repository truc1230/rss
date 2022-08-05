import Parser from 'html-react-parser';

const GhostContent = ({ content }) => {
    return (
        <div id="ghost_global">
            <div id="ghost_content" className="max-w-[1145px] flex flex-col items-start">
                <section className="gh-content w-full mt-4 sm:mt-6 lg:mt-8 !text-xs sm:!text-sm lg:!text-[16px]">
                    {content && Parser(content)}
                </section>
            </div>
        </div>
    )
}

export default GhostContent
