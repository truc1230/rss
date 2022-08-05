import ContentLoader from 'react-content-loader';

export const TextLoader = (props) => (
    <ContentLoader
        speed={2}
        width="100%"
        height={150}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="2" y="15" rx="5" ry="5" width="340" height="10" />
        <circle cx="10" cy="80" r="8" />
        <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
        <circle cx="10" cy="110" r="8" />
        <rect x="25" y="105" rx="5" ry="5" width="220" height="10" />
        <circle cx="10" cy="140" r="8" />
        <rect x="25" y="135" rx="5" ry="5" width="220" height="10" />
        <rect x="2" y="42" rx="5" ry="5" width="325" height="10" />
    </ContentLoader>
);

export const FormLoader = (props) => (
    <ContentLoader
        speed={2}
        width="100%"
        height="100%"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="10" rx="5" ry="5" width="600" height="60" />
        <rect x="0" y="90" rx="5" ry="5" width="600" height="60" />
        <rect x="0" y="170" rx="5" ry="5" width="600" height="60" />
        <rect x="0" y="250" rx="5" ry="5" width="600" height="60" />
        <rect x="0" y="330" rx="5" ry="5" width="600" height="60" />
        <rect x="0" y="410" rx="5" ry="5" width="600" height="60" />
        <rect x="0" y="490" rx="5" ry="5" width="290" height="60" />
        <rect x="310" y="490" rx="5" ry="5" width="290" height="60" />
    </ContentLoader>
);

export default {
    TextLoader,
    FormLoader,
};
