import { ReactNotifications } from 'react-notifications-component';

const LayoutNoHeader = ({ showBanner, children }) => {
    return (
        <div className="h-screen flex flex-col flex-grow">
            <ReactNotifications />
            <>{children}</>
        </div>
    );
};

export default LayoutNoHeader;
