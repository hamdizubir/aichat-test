import styled from "styled-components";
import QueueAnim from "rc-queue-anim";
import Heart from "react-heart";

const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  border-color: black;
  border-style: solid;
  justify-content: space-around;
  align-items: flex-start;
`;

const TableItem = styled.div`
  display: flex;
  flex-direction: row;
`;

const TableHeaderTitle = styled.p`
  flex: 1;
  padding-left: 24px;
`;

export const MovieTable = ({
  movies,
  handleClickMovieTitle,
  handleClickHeart,
  isSearch,
}) => {
  return (
    <>
      <TableHeader>
        <TableHeaderTitle>Title</TableHeaderTitle>
        <TableHeaderTitle>Year</TableHeaderTitle>
        <TableHeaderTitle>IMDB id</TableHeaderTitle>
      </TableHeader>
      <QueueAnim delay={300} className="queue-simple">
        {movies.map((item, index) => (
          <TableItem key={index}>
            <a style={{ flex: 1 }} onClick={handleClickMovieTitle(item.imdbID)}>
              {item.Title}
            </a>
            <p style={{ flex: 1 }}>{item.Year}</p>
            <p style={{ flex: 1 }}>{item.imdbID}</p>
            <div style={{ width: "2rem" }}>
              <Heart
                isActive={item.isFavourite}
                onClick={handleClickHeart(item, isSearch)}
                animationTrigger="both"
                inactiveColor="rgba(255,125,125,.75)"
                activeColor="#ff0000"
                animationDuration={0.1}
              />
            </div>
          </TableItem>
        ))}
      </QueueAnim>
    </>
  );
};
