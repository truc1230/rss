import Head from 'next/head';

const APP_URL = process.env.APP_URL

const socialTags = (props) => {
    const {
        url,
        title,
        description,
        image,
        createdAt,
        updatedAt,
    } = props
    return [
        {name: 'twitter:card', content: 'summary'},
        {name: 'twitter:site', content: '@Nami'},
        {name: 'twitter:title', content: title},
        {name: 'twitter:description', content: description},
        {name: 'twitter:creator', content: '@Nami'},
        {name: 'twitter:image:src', content: image},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'og:title', content: title},
        {name: 'og:url', content: APP_URL + url},
        {name: 'og:image', content: image},
        {name: 'og:site_name', content: 'Nami Exchange'},
        {name: 'og:description', content: description},
        {name: 'og:published_time', content: createdAt},
        {name: 'og:modified_time', content: updatedAt},
    ];
};

const SEO = (props) => {
    const {
        title,
        description,
        keywords,
        image
    } = props;
    return <Head>
        <title>{title}</title>
        <meta key="name" itemprop="name" content={title}/>
        <meta key="description" name="description" content={description}/>
        <meta key="image" itemprop="image" content={image}/>
        {keywords && <meta key="keywords" name="keywords" content={keywords}/>}
        {socialTags(props).map(({name, content}) => {
            return <meta key={name} name={name} content={content}/>;
        })}
    </Head>
};

SEO.defaultProps = {
    image: "https://static.namifutures.com/nami.exchange/images/common-featured.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export default SEO
