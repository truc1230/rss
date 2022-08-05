import ContentLoader from 'react-content-loader';

const UserLoader = props => {
    return (
        <ContentLoader
            speed={1}
            width={250}
            height={32}
            style={{ display: 'block' }}
            viewBox="0 0 150 32"
            backgroundColor="#f3f3f3"
            foregroundColor="#ffffff"
            {...props}
        >
            <circle cx="16" cy="16" r="16" />
            <rect x="40" y="10" rx="0" ry="0" width="100" height="12" />
        </ContentLoader>
    );
};

export default UserLoader;
