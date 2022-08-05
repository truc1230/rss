import ContentLoader from 'react-content-loader';

const SignalConfigLoader = (props) => (
    <div className="rounded-2xl bg-white mb-4 py-4 px-6 border border-black-200 border-l-8 h-[120px] flex items-center">
        <ContentLoader
            speed={2}
            width="100%"
            height={50}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
        >
            <rect x="60" y="30" rx="3" ry="3" width="52" height="10" />
            <rect x="60" y="4" rx="3" ry="3" width="410" height="15" />
            <rect x="0" y="2" rx="5" ry="5" width="45" height="45" />
        </ContentLoader>
    </div>
);

export default SignalConfigLoader;
