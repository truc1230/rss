import ContentLoader from 'react-content-loader';

const EarningCardLoader = (props) => (
    <ContentLoader
        speed={2}
        width={390}
        height={360}
        viewBox="0 0 390 380"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
        className="mx-auto"
    >
        <rect x="127" y="40" rx="3" ry="3" width="88" height="20" />
        <rect x="127" y="77" rx="3" ry="3" width="180" height="10" />
        <rect x="29" y="156" rx="3" ry="3" width="60" height="15" />
        <circle cx="47" cy="51" r="23" />
        <circle cx="69" cy="74" r="23" />
        <rect x="310" y="156" rx="3" ry="3" width="50" height="15" />
        <rect x="29" y="191" rx="3" ry="3" width="140" height="15" />
        <rect x="230" y="191" rx="3" ry="3" width="130" height="15" />
        <rect x="29" y="226" rx="3" ry="3" width="30" height="15" />
        <rect x="320" y="226" rx="3" ry="3" width="40" height="15" />
        <rect x="29" y="260" rx="3" ry="3" width="165" height="15" />
        <rect x="251" y="260" rx="3" ry="3" width="109" height="15" />
        <rect x="29" y="303" rx="3" ry="3" width="330" height="47" />
        <rect x="0" y="0" rx="10" ry="10" width="400" height="10" />
        <rect x="0" y="0" rx="10" ry="10" width="10" height="380" />
        <rect x="380" y="0" rx="10" ry="10" width="10" height="380" />
        <rect x="0" y="370" rx="10" ry="10" width="390" height="10" />
    </ContentLoader>
);

export default EarningCardLoader;
