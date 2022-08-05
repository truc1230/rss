import ContentLoader from 'react-content-loader';

const MembershipHistoryLoader = props => {
    return (
        <ContentLoader
            height={54}
            width="100%"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
        >
            <circle cx="27" cy="27" r="18" />
            <rect x="53" y="14" rx="3" ry="3" width="80%" height="13" />
            <rect x="53" y="30" rx="3" ry="3" width="80" height="10" />
            <rect x="67" y="30" rx="3" ry="3" width="40%" height="10" />
            <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
        </ContentLoader>
    );
};

export default MembershipHistoryLoader;
