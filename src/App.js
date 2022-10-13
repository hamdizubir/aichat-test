import styled from "styled-components";
import "./App.css";
import { Tabs, Input, Button } from "antd";
import "antd/dist/antd.css";
import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import axios from "axios";
import { MovieDetail } from "./movieDetail";
import { MovieTable } from "./movieTable";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  gap: 50px;
`;

const apiKey = "c66a188a";

const checkFavouriteList = (favMoviesStorage, favMovie, setFavMovie) => {
  const arr = favMovie.map((movie) => {
    if (favMoviesStorage.find((fav) => fav.imdbID === movie.imdbID)) {
      return {
        ...movie,
        isFavourite: true,
      };
    } else {
      return {
        ...movie,
        isFavourite: false,
      };
    }
  });
  setFavMovie(arr);
};

const checkFavouriteListSearch = (
  favMoviesStorage,
  searchResult,
  setSearchResult
) => {
  const arr = searchResult.map((movie) => {
    if (favMoviesStorage.find((fav) => fav.imdbID === movie.imdbID)) {
      return {
        ...movie,
        isFavourite: true,
      };
    } else {
      return {
        ...movie,
        isFavourite: false,
      };
    }
  });
  setSearchResult(arr);
};

const searchMovie = async (
  searchQuery,
  page,
  setSearchResult,
  setIsLoading,
  setErrorGetList,
  setTotalResult,
  favMovie
) => {
  setIsLoading(true);
  setErrorGetList(false);
  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKey}&page=${page}`
    );
    setIsLoading(false);
    if (res.data.Response !== "True") {
      return setErrorGetList(true);
    }
    setTotalResult(res.data.totalResults);
    checkFavouriteListSearch(favMovie, res.data.Search, setSearchResult);
  } catch (error) {
    setErrorGetList(true);
    setIsLoading(false);
    throw error;
  }
};

const getMovieDetail = async (id, setMovieDetail, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`
    );
    setIsLoading(false);
    return setMovieDetail(res.data);
  } catch (error) {
    setIsLoading(false);
    throw error;
  }
};

function App() {
  const [searchResult, setSearchResult] = React.useState([]);
  const [totalResult, setTotalResult] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorGetList, setErrorGetList] = React.useState(false);

  const [page, setPage] = React.useState(1);

  const [isShowModal, setIsShowModal] = React.useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);
  const [movieDetail, setMovieDetail] = React.useState();

  const [favMovie, setFavMovie] = React.useState(
    JSON.parse(window.localStorage.getItem("favMovie")) || []
  );

  const handleChangePage = (type) => () => {
    if (type === "next") {
      setPage(page + 1);
      searchMovie(
        searchQuery,
        page + 1,
        setSearchResult,
        setIsLoading,
        setErrorGetList,
        setTotalResult,
        favMovie
      );
    } else {
      setPage(page - 1);
      searchMovie(
        searchQuery,
        page - 1,
        setSearchResult,
        setIsLoading,
        setErrorGetList,
        setTotalResult,
        favMovie
      );
    }
  };

  const handleClickHeart = (movie, isSearch) => () => {
    const duplicateMovieIndex = favMovie.findIndex(
      (item) => item.imdbID === movie.imdbID
    );
    let newList = favMovie;
    if (duplicateMovieIndex + 1 > 0) {
      newList.splice(duplicateMovieIndex, 1);
    } else {
      newList.push({ ...movie, isFavourite: true });
    }
    if (isSearch) {
      checkFavouriteListSearch(newList, searchResult, setSearchResult);
    } else {
      checkFavouriteList(newList, favMovie, setFavMovie);
    }
    window.localStorage.setItem("favMovie", JSON.stringify(newList));
  };

  const handleClickMovieTitle = (id) => () => {
    getMovieDetail(id, setMovieDetail, setIsLoadingDetail);
    setIsShowModal(true);
  };

  return (
    <>
      <Tabs
        style={{
          padding: "20vh",
        }}
        defaultActiveKey="1"
        onChange={() => {
          if (searchQuery) {
            searchMovie(
              searchQuery,
              page,
              setSearchResult,
              setIsLoading,
              setErrorGetList,
              setTotalResult,
              favMovie
            );
          }
        }}
      >
        <Tabs.TabPane tab="Search Movie" key="1">
          <Container>
            <Input
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={(e) =>
                searchMovie(
                  e.target.value,
                  page,
                  setSearchResult,
                  setIsLoading,
                  setErrorGetList,
                  setTotalResult,
                  favMovie
                )
              }
              size="large"
              placeholder="Enter movie title here..."
              prefix={<SearchOutlined />}
            />
            {errorGetList && <h3>Error get movie, please review your input</h3>}
            {isLoading && <h3>loading movie...</h3>}
            {!isLoading &&
            !errorGetList &&
            searchResult &&
            searchResult.length > 0 ? (
              <>
                <MovieTable
                  movies={searchResult}
                  handleClickMovieTitle={handleClickMovieTitle}
                  handleClickHeart={handleClickHeart}
                  isSearch={true}
                />
                <div
                  style={{ gap: "12px", display: "flex", alignItems: "center" }}
                >
                  <h4>Page Number: {page}</h4>
                  <h4>Total: {totalResult}</h4>
                  <h4>Shown: {searchResult.length}</h4>
                  {page > 1 && (
                    <Button onClick={handleChangePage("previous")}>
                      Previous Page
                    </Button>
                  )}
                  {totalResult > page * searchResult.length &&
                    // Max page according to omdb api
                    page !== 100 && (
                      <Button onClick={handleChangePage("next")}>
                        Next Page
                      </Button>
                    )}
                </div>
              </>
            ) : (
              !errorGetList &&
              !isLoading && <h3>Enter movie title and press enter</h3>
            )}
          </Container>
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Favourite" key="2">
          <Container>
            {favMovie.length === 0 && <h3>You havent add a favourite movie</h3>}
            {favMovie && favMovie.length > 0 && (
              <MovieTable
                movies={favMovie}
                handleClickMovieTitle={handleClickMovieTitle}
                handleClickHeart={handleClickHeart}
                isSearch={false}
              />
            )}
          </Container>
        </Tabs.TabPane>
      </Tabs>

      {isShowModal && (
        <MovieDetail
          isLoadingDetail={isLoadingDetail}
          movieDetail={movieDetail}
          setIsShowModal={setIsShowModal}
          setMovieDetail={setMovieDetail}
        />
      )}
    </>
  );
}

export default App;
