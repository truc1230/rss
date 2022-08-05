import Image from 'next/image';

const NotificationContent = (props) => {
    const { type, title, message } = props;
    return (
        <div className="flex items-center py-3 px-5 bg-white rounded notification-shadow w-full">
            <div className="mr-3">
                <Image src={`/images/icons/icon-${type}.svg`} width={32} height={32} />
            </div>
            <div className="flex flex-grow flex-col">
                <div>{title}</div>
                <div className="text-black-500 text-sm">{message}</div>
            </div>
        </div>
    );
};

export default NotificationContent;
