import ContentLoader from 'react-content-loader';

const PostLoader = (props) => (
    <ContentLoader
        speed={2}
        width={400}
        height={460}
        viewBox="0 0 400 460"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="260" rx="4" ry="4" width="129" height="21" />
        <rect x="0" y="3" rx="16" ry="16" width="400" height="248" />
        <rect x="0" y="295" rx="4" ry="4" width="399" height="36" />
        <rect x="0" y="355" rx="4" ry="4" width="399" height="50" />
        <rect x="0" y="425" rx="4" ry="4" width="129" height="10" />
    </ContentLoader>
);

export default PostLoader;
