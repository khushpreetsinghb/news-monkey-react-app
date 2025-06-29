import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = ({ country = 'us', pageSize = 12, category = 'general', setProgress }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    // document.title = `${capitalizeFirstLetter(category)} - NewsMonkey`;

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async () => {
        setProgress(10);
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
        setLoading(true);
        console.log(url);
        let data = await fetch(url);
        setProgress(30);
        let parsedData = await data.json();
        setProgress(70);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        setProgress(100);
    }

    useEffect(() => {
        updateNews();
    }, []);

    const handlePrevClick = async () => {
        setPage(page - 1);
        updateNews();
    }

    const handleNextClick = async () => {
        setPage(page + 1);
        updateNews();
    }

    const fetchMoreData = async () => {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page + 1}&pageSize=${pageSize}`;
        setPage(page + 1);
        setLoading(true);
        console.log(url);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
        setLoading(true);
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(category)} Headlines</h1>
            {/* {loading && <Spinner />} */}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={loading && <Spinner />}>
                <div className="container">
                    <div className="row">
                        {articles.map((element, ind) => {
                            return <div className="col-md-4" key={ind}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
            {/* <div className="container d-flex justify-content-between">
                    <button disabled={page <= 1} type="button" className="btn btn-light border border-1" onClick={handlePrevClick}> &larr; Previous</button>
                    <button disabled={page + 1 > Math.ceil(totalResults / pageSize)} type="button" className="btn btn-light border border-1" onClick={handleNextClick}>Next &rarr;</button>
                </div> */}
        </>
    )
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News;