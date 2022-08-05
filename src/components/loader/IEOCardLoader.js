import ContentLoader from 'react-content-loader';

const IEOCardLoader = (props) => {
    if (props.direction === 'vertical') {
        return (
            <ContentLoader
                speed={2}
                width="100%"
                height="100%"
                viewBox="0 0 600 640"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
            >
                <rect x="0" y="0" rx="3" ry="3" width="600" height="6" />
                <rect x="0" y="0" rx="3" ry="3" width="6" height="600" />
                <rect x="0" y="594" rx="3" ry="3" width="600" height="6" />
                <rect x="594" y="0" rx="3" ry="3" width="6" height="600" />
                <rect x="25" y="21" rx="10" ry="10" width="548" height="224" />
                <rect x="25" y="274" rx="3" ry="3" width="250" height="20" />
                <rect x="25" y="312" rx="3" ry="3" width="320" height="10" />
                <rect x="25" y="380" rx="3" ry="3" width="145" height="10" />
                <rect x="25" y="420" rx="3" ry="3" width="120" height="10" />
                <rect x="25" y="460" rx="3" ry="3" width="190" height="10" />
                <rect x="25" y="500" rx="3" ry="3" width="110" height="10" />
                <rect x="25" y="560" rx="3" ry="3" width="140" height="15" />
                <rect x="318" y="380" rx="3" ry="3" width="170" height="10" />
                <rect x="318" y="420" rx="3" ry="3" width="120" height="10" />
                <rect x="318" y="462" rx="3" ry="3" width="142" height="10" />
                <rect x="318" y="500" rx="3" ry="3" width="175" height="10" />
            </ContentLoader>
        );
    }
    return (
        <ContentLoader
            width="100%"
            height={340}
            viewBox="0 0 840 340"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            speed={2}
            {...props}
        >
            <rect x="4" y="8" rx="3" ry="3" width="7" height="288" />
            <rect x="6" y="289" rx="3" ry="3" width="100%" height="8" />
            <rect x="834" y="9" rx="3" ry="3" width="6" height="285" />
            <rect x="30" y="30" rx="16" ry="16" width="376" height="246" />
            <rect x="450" y="143" rx="3" ry="3" width="102" height="7" />
            <rect x="450" y="121" rx="3" ry="3" width="178" height="6" />
            <rect x="450" y="169" rx="3" ry="3" width="178" height="6" />
            <rect x="450" y="192" rx="3" ry="3" width="102" height="7" />
            <rect x="450" y="229" rx="3" ry="3" width="178" height="6" />
            <rect x="5" y="8" rx="3" ry="3" width="100%" height="7" />
            <rect x="450" y="253" rx="3" ry="3" width="72" height="6" />
            <rect x="450" y="70" rx="3" ry="3" width="231" height="10" />
            <rect x="450" y="41" rx="3" ry="3" width="201" height="20" />
        </ContentLoader>
    );
};

export default IEOCardLoader;
