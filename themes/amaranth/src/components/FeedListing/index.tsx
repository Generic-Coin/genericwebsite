import * as React from "react";
import styled from "styled-components";

import { Types } from "gatsby-theme-advanced";

import ArticleCard from "../ArticleCard";
import { constants } from "../../theme";
import LayoutWidthContainer from "../shared/LayoutWidthContainer";

const Wrapper = styled.div`
  width: 100%;

  display: block;
  grid-gap: 80px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${constants.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const WidthLimitedGrid = styled(LayoutWidthContainer)`
  display: block;
  grid-template-columns: 100%;
  gap: 80px;
  align-content: space-between;
  justify-items: stretch;
`;

type PostListingProps = {
  listing: Types.FeedList;
  noHero?: boolean;
};

const FeedListing = ({ listing, noHero }: PostListingProps): JSX.Element => (
  <WidthLimitedGrid>
    <p>Generic Coin is a Binance Smart Chain project that focuses on features that users find important in today's evolving crypto landscape.<br />
    You can buy Generic Coin<br />
    You can sell Generic Coin<br />
    You can send Generic Coin<br />
    Have a Generic Day! - The Generic Coin Team.</p>
    <br />
    <Wrapper>
      {listing.map((feedItem, idx) => {
        // Check if we're rendering a placeholder
        if ("isPlaceholder" in feedItem)
          return <ArticleCard key={feedItem.key} />;

        return idx === 0 && !noHero ? (
          <ArticleCard key={feedItem.slug} post={feedItem} hero />
        ) : (
          <ArticleCard key={feedItem.slug} post={feedItem} />
        );
      })}
    </Wrapper>
  </WidthLimitedGrid>
);

export default FeedListing;
