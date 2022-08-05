import { ReactNotifications } from 'react-notifications-component'
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../NavBar';

const LayoutWithHeader = ({ showBanner, children, hidden }) => {
    const _renderNav = useMemo(() => {
        return <NavBar />;
    }, []);
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    return (
        <div className="md:h-screen flex flex-col">
            <ReactNotifications />
            { !hidden && _renderNav }
            <>{children}</>
        </div>
    );
};

export default LayoutWithHeader;
