/* eslint-disable */
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import Footer from 'src/components/common/Footer';

const Privacy = () => {
    const router = useRouter();
    const { locale } = router;

    return (
        <LayoutWithHeader>
            <div className="nami-container my-20 policies-page">
                <>
                    <div className="text-center">
                        <h1 className="text-4xl font-semibold mb-7 ">
                            Nami Exchange Privacy Policy
                        </h1>

                    </div>

                    <div className="card bg-white rounded-lg text-tiny">
                        <p className="text-right pb-5">
                            <strong>Effective Date: Dec 6th 2019</strong>
                        </p>
                        <p>This notice was prepared in the English language and the English language version shall
                            prevail in the event of any conflict, discrepancy or ambiguity between translations.</p>
                        <ul>
                            <li>Summary of how we use your data</li>
                            <li>What does this notice cover?</li>
                            <li>What personal data do we process?</li>
                            <li>How do we use this personal data, and what is the legal basis for this use?</li>
                            <li>Fully-automated decision-making that could have significant effects on you</li>
                            <li>Relying on our legitimate interests</li>
                            <li>Withdrawing consent or otherwise objecting to direct marketing</li>
                            <li>Who will we share this data with, and where?</li>
                            <li>Cookies and related technologies</li>
                            <li>External links</li>
                            <li>Changes to this Notice</li>
                            <li>Getting in touch with us</li>
                        </ul>
                        <p className="mt-6 mb-2 text-base"><strong>Summary of how we use your data</strong></p>
                        <p>We respect your privacy and are committed to protecting it as described in this notice.</p>
                        <p>Nami.exchange do not require specific personal information for KYC. We use your personal data
                            to provide, improve and administer the nami.exchange platform, to enter into and perform the
                            terms of service with our users, and to comply with regulatory requirements.</p>
                        <p>Data is shared with our vendors, and when we have a good faith belief that doing so is
                            necessary to comply with regulatory enquiries or requirements.</p>
                        <p>Our privacy notice sets out more details of this processing, including details of your data
                            protection rights.</p>
                        <p className="mt-6 mb-2 text-base"><strong>What does this notice cover?</strong></p>
                        <p>This notice describes how nami.exchange and its affiliates (referred to
                            as &ldquo;Nami&rdquo;, &ldquo;we&rdquo; or &ldquo;us&rdquo; in this notice) will collect,
                            make use of and share (i.e. &ldquo;process&rdquo;) your personal data in connection with the
                            nami.exchange website, apps and services (including API services).</p>
                        <p>This notice also describes data protection rights you may have (depending on applicable law),
                            such as a right to object to some of the processing which nami.exchange carries out. More
                            information about your rights, and how to exercise them, is set out in
                            the <strong>&ldquo;Your rights&rdquo; section</strong>.</p>
                        <p className="mt-6 mb-2 text-base"><strong>What personal data do we process?</strong></p>
                        <p>We process personal data about you when you interact with us, our websites, our apps or our
                            services (including API services). This includes:</p>
                        <p>Your email address / username, password and other login/security details (e.g. app passcode,
                            two-factor authentication, token seed record, public PGP key), and login records;</p>
                        <p>Your payment details / bitcoin wallet address;</p>
                        <p>Your account and portfolio details, such as live and historical orders, trades and positions,
                            and balances;</p>
                        <p>Your site and account preferences, including site notification, sounds and confirmation
                            dialogs and leaderboard preferences;</p>
                        <p>Your self-reported location plus the geolocation of the IP address you connect from;</p>
                        <p>Your marketing and other communication preferences, and a record of any consents you have
                            given us;</p>
                        <p>Information related to the browser or device you use to access our website or apps, as well
                            as data that tells us which features of the website/app are popular, or suffer from issues
                            we need to fix;</p>
                        <p>The content and details (e.g. date) of messages you post in chatbox with support team, or
                            that you send us (e.g. customer support queries); and customer service notes and other
                            records.</p>
                        <p>We will aim to mark data fields as optional or mandatory when collecting personal data from
                            you via forms. Note, in particular, that to create an account, engage in transactions, and
                            where necessary, prove your identity, the provision of personal data is typically mandatory:
                            if relevant data is not provided, then we will not be able to do these things and provide
                            the services you expect.</p>
                        <p>We do not collect fingerprints, facial recognition data, or other biometrics. Where you
                            enable biometric security (such as fingerprint or Face ID login), your biometrics will be
                            handled by your device, not by us.</p>
                        <p className="mt-6 mb-2 text-base"><strong>How do we use this personal data, and what is the
                            legal basis for this use?</strong></p>
                        <p>We process this personal data for the following purposes:</p>
                        <p>To fulfil (or take steps linked to) a service agreement with you. This includes:</p>
                        <ul>
                            <li>creating your account;</li>
                            <li>taking deposits and fees, and paying out withdrawals;</li>
                            <li>allowing you to make trades, maintaining your account and trading history, and closing /
                                auto-deleveraging / liquidating positions in accordance with our published policies and
                                terms of service;
                            </li>
                            <li>communicating with you; and</li>
                            <li>providing customer services;</li>
                        </ul>
                        <p>To monitor, improve and protect the services on our website and apps, in particular by
                            looking at how they are used, testing alternatives (e.g. by &ldquo;A/B testing&rdquo;, and
                            running &ldquo;beta&rdquo; version trials), and by learning from feedback and comments you
                            provide;</p>
                        <p>To personalise our website, apps and services;</p>
                        <p>To invite individuals to take part in market research and beta tests.</p>
                        <p>Where you give us consent (so far as that consent is required):</p>
                        <p>We will send you direct marketing in relation to our relevant products and services, or other
                            products and services provided by us and carefully selected partners;</p>
                        <p>We place cookies, monitor email engagement, and use other similar technologies in accordance
                            with our Cookies Notice and the information provided to you when those technologies are
                            used;</p>
                        <p>On other occasions where we ask you for consent, we will use the data for the purpose which
                            we explain at that time.</p>
                        <p>For purposes which are required by law, in particular: in response to requests by relevant
                            courts and public authorities, such as those conducting an investigation.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Fully-automated decision-making that could have
                            significant effects on you</strong></p>
                        <p>As the service documentation on our site and our terms of service explain, our trading
                            platform applies certain automatic processes based on your trading positions and the
                            resources on your account.</p>
                        <p>For example, most nami.exchange instruments are highly leveraged. To keep positions in these
                            instruments open, traders are required to hold a percentage of the value of the position on
                            the exchange, known as the Maintenance Margin percentage. If you cannot fulfil your
                            maintenance requirement, and liquidation is therefore triggered, we will cancel open orders
                            on the current instrument, you will be partially or fully liquidated, and your maintenance
                            margin can be lost.</p>
                        <p>Other significant automated decision-making that uses your personal data may also be
                            employed, to protect accounts and to uphold our terms of service.&nbsp;</p>
                        <p>API usage and behaviour is monitored in order to protect our systems and to uphold our terms
                            of service. Automated decision-making may be employed to manage your account&rsquo;s API
                            access or rate limit permits based on your API usage and trading behaviour (this may include
                            limiting or preventing access and activity on your account).</p>
                        <p className="mt-6 mb-2 text-base"><strong>Relying on our legitimate interests</strong></p>
                        <p>To the extent required by law, we aim to carry out balancing tests when significant data
                            processing activities are justified on the basis of our &ldquo;legitimate interests&rdquo;,
                            as described above.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Withdrawing consent or otherwise objecting to direct
                            marketing</strong></p>
                        <p>Wherever we rely on your consent, you will always be able to withdraw that consent, although
                            we may have other legal grounds for processing your data for other purposes, such as those
                            set out above. In some cases, we are able to send or display marketing without your consent.
                            You have an absolute right to opt-out of direct marketing, or profiling we carry out for
                            direct marketing, at any time. You can do this by following the instructions in the
                            communication where this is an electronic message, changing your account settings, or by
                            contacting us using the details set out below.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Who will we share this data with, and where?</strong>
                        </p>
                        <p>Personal data may be shared with courts or public authorities if required as described above,
                            mandated by law, or required for the legal protection of our or third party legitimate
                            interests, in compliance with applicable laws and authorities&rsquo; requests.</p>
                        <p>In the event that the business is sold or integrated with another business, your details will
                            be disclosed to our advisers and any prospective purchaser&rsquo;s advisers, and to the new
                            owners of the business.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Cookies and related technologies</strong></p>
                        <p>We use cookies (and local storage objects, but we refer to these collectively
                            as &ldquo;cookies&rdquo; below), web beacons/tags, and other related approaches to collect
                            information about your use of our website. Cookies are small pieces of information sent by a
                            web server to a web browser, to allow certain functionality or analytics. In particular, we
                            use the following:</p>
                        <p><em>Strictly Necessary Cookies</em></p>
                        <p>These cookies are essential in order to enable you to move around the website and use its
                            features.</p>
                        <p>Without these cookies, things you have asked for such as remembering your login details or
                            trade orders cannot be provided.</p>
                        <p>We also use these cookies to balance traffic over multiple servers, so we can keep it
                            responsive and capable of dealing with high traffic from all users.</p>
                        <p><em>Performance Cookies</em></p>
                        <p>These cookies collect information on how people use our website. For example, we use these to
                            help us understand how customers arrive at our site, browse or use our site and highlight
                            areas where we can improve areas such as navigation, trading, customer support and
                            marketing.</p>
                        <p><em>Functionality Cookies</em></p>
                        <p>These cookies remember choices you make such as the country you visit from, and language and
                            search parameters. These can then be used to provide you with an experience more appropriate
                            to your selections.</p>
                        <p><em>Controlling these technologies</em></p>
                        <p>If you want to delete any cookies, please check your browser or device settings (and help
                            pages) for instructions on how to delete them. Your browser or device may also offer
                            tracking controls for things other than cookies, such as beacons and tags.</p>
                        <p>Please note that by deleting our cookies or disabling future cookies, in particular
                            the &ldquo;strictly necessary&rdquo; cookies described above, you may not be able to access
                            certain areas or features of our site.</p>
                        <p className="mt-6 mb-2 text-base"><strong>External links</strong></p>
                        <p>Although our website and apps only look to include quality, safe and relevant external links,
                            users should always adopt a policy of caution before clicking any links to non-HDR Group
                            websites or apps. We cannot control, guarantee or verify their contents. They will have
                            their own policies and practices, for example with regard to privacy and personal data, and
                            you should acquaint yourselves with those before further engaging with those third party
                            websites or apps.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Changes to this Notice</strong></p>
                        <p>We may revise this Privacy Notice from time to time. If we make a change to this notice that
                            we consider material, we will take steps to notify users by a notice on the website and/or
                            app. Your continued use of the nami.exchange website, apps and services (including API
                            services) will be subject to the updated Privacy Notice.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Getting in touch with us</strong></p>
                        <p>If you have any questions or concerns about how we process your data, you can get in touch
                            with us at support@nami.exchange.</p>
                    </div>
                </>

            </div>
            <Footer/>
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['footer', 'navbar', 'common']),
    },
});
export default Privacy;
