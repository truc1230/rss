import { useTranslation } from 'next-i18next';

const EmailSubscribeForm = () => {
    const { t } = useTranslation('footer');

    return (
        <form className="">
            <div className="form-wrapper flex justify-between items-center">
                <div className="flex-grow">
                    <input
                        className="form-control border-0"
                        type="email"
                        placeholder={t('email_subscription_placeholder')}
                    />
                </div>

                <div className="">
                    <button
                        className="btn btn-primary"
                        type="button"
                    >
                        {t('email_subscription_button')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EmailSubscribeForm;
