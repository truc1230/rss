import Axios from 'axios';

import { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import LastedNews from 'src/components/screens/Home/News/LastedNews';
import News from 'src/components/screens/Home/News/News';
import { ghost } from 'utils';

const HomeNews = () => {
    // Initial State
    const [state, set] = useState({
        loadingNews: false,
        news: null,
        lastedNewsAutoplay: true
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    const { i18n: { language } } = useTranslation()

    const getNewPostsBanner = async (lang = 'vi') => {
        try {
            const en = lang === 'en' ? 'en' : '-en';
            const result = await ghost.posts.browse(
                {
                    limit: 10,
                    filter: `featured:true+tags:${en}`,
                    include: 'tags',
                }   
            )
            if (result) {
                setState({ news: result })
            }
        } catch (e) {
        }
    }

    // Helper
    const getNews = async (lang = 'vi') => {
        setState({ loadingNews: true })
        try {
            const { status, data: news } = await Axios.get(`https://nami.io/api/v1/top_posts?language=${lang}`)
            if (status === 200 && news) {
                setState({ news })
            }
        } catch (e) {
            console.log('Cant get news data: ', e)
        } finally {
            setState({ loadingNews: false })
        }
    }

    useEffect(() => {
        getNewPostsBanner(language)
    }, [language])


    return (
        <section className="homepage-news">
            <div className="homepage-news___wrapper mal-container">
                {state.news && <News data={state.news} lang={language} />}
                {state.news && <LastedNews data={state.news} lang={language} />}
            </div>
        </section>
    )
}

export default HomeNews
