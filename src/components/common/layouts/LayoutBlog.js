import { useMemo } from 'react';
import NavBar from 'src/components/common/NavBar/NavBar';
import Footer from 'src/components/common/Footer';
import { useRouter } from 'next/router';
import { ReactNotifications } from 'react-notifications-component'

const LayoutBlog = ({ children, loaded = false }) => {
    const router = useRouter();
    const { query } = router;
    const _renderNav = useMemo(() => {
        return <NavBar />;
    }, []);
    return (
        <>
            <ReactNotifications />
            <div className="md:h-screen flex flex-col">
                {!query.mobile && loaded && _renderNav }
                <>{children}</>
                {!query.mobile && loaded && <Footer /> }
            </div>
        </>
    );
};

export default LayoutBlog;
