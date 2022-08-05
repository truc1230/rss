import ContentLoader from 'react-content-loader';

const SignalNotificationLoader = (props) => (
    <div className="max-w-[620px] bg-white rounded-xl mb-2.5 px-6 py-5 mx-auto border border-black-200">
        <ContentLoader
            speed={2}
            width="100%"
            height={40}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
        >
            <rect x="50" y="26" rx="3" ry="3" width="52" height="6" />
            <rect x="50" y="6" rx="3" ry="3" width="410" height="6" />
            <circle cx="20" cy="20" r="20" />
        </ContentLoader>
    </div>
);

export default SignalNotificationLoader;
