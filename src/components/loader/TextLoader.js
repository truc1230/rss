import ContentLoader from 'react-content-loader';

const TextLoader = props => {
    return (
        <ContentLoader
            style={{ display: 'inline' }}
            width="30%"
            height="100%"
            backgroundColor="#f3f3f390"
            foregroundColor="#ffffff90"
            {...props}
        >
            <rect x="0" y="10%" rx="5" ry="5" width="100%" height="80%" />
        </ContentLoader>
    );
};

export default TextLoader;
