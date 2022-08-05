import ContentLoader from 'react-content-loader';

const TradingHistoryDetailLoader = (props) => (
    <ContentLoader
        speed={2}
        width="100%"
        height={280}
        viewBox="0 0 400 280"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="11" rx="5" ry="5" width="100" height="20" />
        <rect x="0" y="60" rx="5" ry="5" width="100" height="20" />
        <rect x="0" y="108" rx="5" ry="5" width="100" height="20" />
        <rect x="0" y="156" rx="5" ry="5" width="100" height="20" />
        <rect x="0" y="202" rx="5" ry="5" width="100" height="20" />
        <rect x="310" y="314" rx="5" ry="5" width="290" height="20" />
        <rect x="0" y="314" rx="5" ry="5" width="230" height="20" />
        <rect x="263" y="11" rx="5" ry="5" width="135" height="20" />
        <rect x="212" y="60" rx="5" ry="5" width="189" height="20" />
        <rect x="237" y="108" rx="5" ry="5" width="164" height="20" />
        <rect x="223" y="156" rx="5" ry="5" width="176" height="20" />
        <rect x="182" y="202" rx="5" ry="5" width="216" height="20" />
        <rect x="0" y="250" rx="5" ry="5" width="100" height="20" />
        <rect x="246" y="250" rx="5" ry="5" width="153" height="20" />
    </ContentLoader>
);

export default TradingHistoryDetailLoader;
