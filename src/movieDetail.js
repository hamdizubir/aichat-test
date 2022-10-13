import styled from "styled-components";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalContent = styled.div`
  position: fixed;
  background: white;
  width: 50%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: scroll;
`;
export const MovieDetail = ({
  isLoadingDetail,
  movieDetail,
  setIsShowModal,
  setMovieDetail,
}) => {
  return (
    <ModalContainer>
      <ModalContent>
        {isLoadingDetail && <h3>loading movie detail...</h3>}
        {!isLoadingDetail && movieDetail && (
          <>
            <button
              onClick={() => {
                setIsShowModal(false);
                setMovieDetail(null);
              }}
              style={{ marginTop: "12px" }}
            >
              close detail
            </button>
            <img
              src={movieDetail.Poster}
              style={{
                width: "200px",
                margin: "auto",
              }}
            />
            <h2 style={{ margin: 0, marginBottom: "20px" }}>
              {movieDetail.Title}
            </h2>
            <h4 style={{ margin: 0 }}>Year: {movieDetail.Year}</h4>
            <h4 style={{ margin: 0 }}>Rated: {movieDetail.Rated}</h4>
            <h4 style={{ margin: 0 }}>Released: {movieDetail.Released}</h4>
            <h4 style={{ margin: 0 }}>Runtime: {movieDetail.Runtime}</h4>
            <h4 style={{ margin: 0 }}>Genre: {movieDetail.Genre}</h4>
            <h4 style={{ margin: 0 }}>Director: {movieDetail.Director}</h4>
            <h4 style={{ margin: 0 }}>Writer: {movieDetail.Writer}</h4>
            <h4 style={{ margin: 0 }}>Actors: {movieDetail.Actors}</h4>
            <h4 style={{ margin: 0 }}>Plot: {movieDetail.Plot}</h4>
            <h4 style={{ margin: 0 }}>Language: {movieDetail.Language}</h4>
            <h4 style={{ margin: 0 }}>Country: {movieDetail.Country}</h4>
            <h4 style={{ margin: 0 }}>Awards: {movieDetail.Awards}</h4>
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
};
