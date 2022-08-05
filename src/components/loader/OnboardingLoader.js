import ContentLoader from 'react-content-loader';

const OnboardingLoader = (props) => (
    <ContentLoader
        speed={2}
        width={400}
        height={526}
        viewBox="0 0 400 526"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="418" rx="5" ry="5" width="334" height="50" />
        <rect x="0" y="353" rx="5" ry="5" width="334" height="50" />
        <rect x="0" y="288" rx="5" ry="5" width="334" height="50" />
        <rect x="0" y="223" rx="5" ry="5" width="334" height="50" />
        <rect x="18" y="99" rx="5" ry="5" width="300" height="20" />
        <rect x="75" y="132" rx="5" ry="5" width="180" height="20" />
        <rect x="27" y="66" rx="5" ry="5" width="280" height="20" />
    </ContentLoader>
);

export default OnboardingLoader;
