import { getServerSideSitemap } from 'next-sitemap';
// eslint-disable-next-line no-unused-vars

export const getServerSideProps = async (ctx) => {
    const fields = [];
    return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default () => {
};
