import * as React from "react";
import styled from "styled-components";

import { Types } from "gatsby-theme-advanced";

import ArticleCard from "../ArticleCard";
import { constants } from "../../theme";
import LayoutWidthContainer from "../shared/LayoutWidthContainer";

import GenericSizzle from "./genericday.mp4"
import GenericPoster from "./play.jpg"

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

const Tokenomics = styled.div`
  width: 100%;

  display: block;
  grid-gap: 80px;
  grid-template-columns: 1fr 1fr;

  table {
    min-width: 30rem;
  }
  .main-table {
    margin: 2rem 0;
    td {
      padding: .3rem;
    }
  }

  @media (max-width: ${constants.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const Contract = styled.div`
  width: 80%;
  margin: 2rem 0;
  marquee {
    width:100%;
  }
`

const Videobox = styled.div`
  margin-top: 2rem;
  width:100%;
  max-width:25rem;
  video {
    width:100%;
  }
`

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
        if ("turnedoff_isPlaceholder" in feedItem)
          return <ArticleCard key={feedItem.key} />;

        return idx === 0 && !noHero ? (
          <ArticleCard key={feedItem.slug} post={feedItem} hero />
        ) : (
          <ArticleCard key={feedItem.slug} post={feedItem} />
        );
      })}
    </Wrapper>

    <Contract>
      <h4>Generic Contract</h4>
      <marquee width="100%" direction="left" height="30px">
        <a href="https://bscscan.com/token/0x0E121672dCe41034598ba1D71AA958c4Eb6C4DF3" target="_blank">0x0E121672dCe41034598ba1D71AA958c4Eb6C4DF3</a>
      </marquee>
    </Contract>

    <Tokenomics>
    <table className="main-table" border="2" cellpadding="2" cellspacing="2">
      <thead>
        <tr>
          <td><h4>Generic Tokenomics</h4></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <table border="2" cellpadding="2" cellspacing="2">
              <thead>
                <tr>
                  <td>Buy</td>
                  <td>Sell</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1% team/marketing tax</td>
                  <td>1% team/marketing tax<br />
                      4% locked LP tax</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table border="2" cellpadding="2" cellspacing="2">
              <thead>
                <tr>
                  <td>1,000,000,000 total supply </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>88.3% of total supply for presale</td>
                </tr>
                <tr>
                  <td>44.5% of the total supply for presale</td>
                </tr>
                <tr>
                  <td>
                    43.8% of total supply for liquidity<br />
                    (100% lock for 1 year)
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    </Tokenomics>
    
    <Videobox >
    <video 
      poster={GenericPoster}
      controls
    >
      <source src={GenericSizzle} 
              type="video/mp4" />
    </video>
    </Videobox>
  </WidthLimitedGrid>
);

export default FeedListing;
