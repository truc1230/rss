
const GridLayoutComponent = ({
    key,
    className,
    dark,
    children,
}) => {
    return (
        <div
           className="relative w-full h-full"
        >
            {/* <Cross size={20} className="absolute top-0 right-0 "/>
            <Resize size={20} className="absolute bottom-0 right-0 " /> */}
            {children}
           
        </div>
    );
};

export default GridLayoutComponent;
