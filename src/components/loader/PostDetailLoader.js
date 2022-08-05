import ContentLoader from 'react-content-loader';

const PostDetailLoader = (props) => (
    <ContentLoader
        speed={2}
        width="100%"
        height={460}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="0" rx="4" ry="4" width="30%" height="16" />
        <rect x="0" y="99" rx="4" ry="4" width="100%" height="92" />
        <rect x="0" y="30" rx="4" ry="4" width="100%" height="40" />
        <rect x="0" y="260" rx="4" ry="4" width="100%" height="10" />
        <rect x="0" y="240" rx="4" ry="4" width="50%" height="10" />
        <rect x="0" y="280" rx="4" ry="4" width="100%" height="10" />
        <rect x="0" y="300" rx="4" ry="4" width="100%" height="10" />
        <rect x="0" y="320" rx="4" ry="4" width="100%" height="10" />
        <rect x="0" y="340" rx="4" ry="4" width="100%" height="10" />
        <rect x="0" y="360" rx="4" ry="4" width="100%" height="10" />
        <rect x="0" y="380" rx="4" ry="4" width="100%" height="10" />
    </ContentLoader>
);

export default PostDetailLoader;
