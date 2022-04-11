import * as React from "react";
import styled from "styled-components";

import { Types } from "gatsby-theme-advanced";

import { constants } from "../../theme";
import LayoutWidthContainer from "../shared/LayoutWidthContainer";

import GenericSizzle from "./genericday.mp4";
import GenericPoster from "./play.jpg";

const Contract = styled.div`
  width: 80%;
  margin: 2rem 0;
  marquee {
    width: 100%;
  }
`;

const Tokenomics = styled.div`
  margin: 2rem 0;
  width: 100%;
  display: block;
  grid-gap: 80px;
  grid-template-columns: 1fr 1fr;

  table {
    margin: 1rem 0;
    width: 100%;
    max-width: 30rem;

    td {
      padding: 0.25rem;
    }
  }

  @media (max-width: ${constants.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const Roadmap = styled.div`
  margin: 2rem 0;
  width: 100%;
  display: block;
  grid-gap: 80px;
  grid-template-columns: 1fr 1fr;

  table {
    margin: 1rem 0;
    width: 100%;
    max-width: 30rem;

    td {
      padding: 0.25rem;
    }
  }

  @media (max-width: ${constants.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const Team = styled.div`
  margin: 2rem 0;
`;

const Partnerships = styled.div`
  margin: 2rem 0;
`;

const Videobox = styled.div`
  margin-top: 1rem;
  width: 100%;
  max-width: 25rem;
  video {
    width: 100%;
  }
`;

const Footer = styled.div`
  margin: 2rem 0;
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
    <p>
      Generic Coin is a Binance Smart Chain project that focuses on features
      that users find important in today's evolving crypto landscape.
      <br />
      You can buy Generic Coin
      <br />
      You can sell Generic Coin
      <br />
      You can send Generic Coin
      <br />
      Have a Generic Day! - The Generic Coin Team.
    </p>
    <br />
    {/* <Wrapper>
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
    </Wrapper> */}

    <Videobox>
      <video poster={GenericPoster} controls>
        <source src={GenericSizzle} type="video/mp4" />
      </video>
    </Videobox>

    <Contract>
      <a
        href="https://bscscan.com/token/0x98a61ca1504b92ae768ef20b85aa97030b7a1edf"
        target="_blank"
      >
        <h4>Generic Contract</h4>
        <marquee width="100%" direction="left" height="30px">
          0x98a61ca1504b92ae768ef20b85aa97030b7a1edf
        </marquee>
      </a>
    </Contract>

    <Roadmap>
      <h4>Generic Roadmap</h4>
      <table border="2">
        <tbody>
          <tr>
            <td>Generic LP Farming</td>
          </tr>
          <tr>
            <td>Generic PCS LP</td>
          </tr>
          <tr>
            <td>Generic Website Expansion</td>
          </tr>
          <tr>
            <td>Generic Launchpad</td>
          </tr>
          <tr>
            <td>Generic Game</td>
          </tr>
          <tr>
            <td>Generic Ad Campaign</td>
          </tr>
        </tbody>
      </table>
    </Roadmap>

    <Tokenomics>
      <h4>Generic Tokenomics</h4>
      <table border="2">
        <thead>
          <tr>
            <td>Buy</td>
            <td>Sell</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1% Team/Marketing Tax</td>
            <td>
              1% Team/Marketing Tax
              <br />
              4% Locked LP Tax
            </td>
          </tr>
        </tbody>
      </table>
      <table border="2">
        <thead>
          <tr>
            <td>1,000,000,000,000 Total Supply</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>39.3% of the Total Supply for Presale</td>
          </tr>
          <tr>
            <td>50% of Total Supply for Liquidity (100% Locked for 1 Year)</td>
          </tr>
          <tr>
            <td>
              15% of Total Supply for Private Sale to Raise BUSD to be used for
              Buyback and Burns to Correct Dumps
            </td>
          </tr>
          <tr>
            <td>0.7% of Total Supply for Apeswap's IAO Listing Fee</td>
          </tr>
        </tbody>
      </table>
    </Tokenomics>

    <Team>
      <h4>Generic Team</h4>
      <p>
        <a
          href="mailto:genericcoin@outlook.com"
          target="_blank"
          rel="noreferrer"
        >
          James Smith - Generic CEO
        </a>
      </p>
      <p>
        <a href="https://t.me/stinkitylinkity" target="_blank" rel="noreferrer">
          Lord Johnson - Developer
        </a>
      </p>
      <p>
        <a
          href="https://t.me/fivemilesbeneathcariboucoffee"
          target="_blank"
          rel="noreferrer"
        >
          caribou - UI / UX
        </a>
      </p>
      <p>
        <a href="https://t.me/Mrdoodley" target="_blank" rel="noreferrer">
          Charlie Doodle - Designer
        </a>
      </p>
    </Team>

    <Partnerships>
      <h4>Generic Partnerships</h4>
      <p>
        <a href="https://t.me/IslandShibsChat" target="_blank" rel="noreferrer">
          Island Shibs - t.me/IslandShibsChat
        </a>
      </p>
      <p>
        <a href="https://t.me/partyhat" target="_blank" rel="noreferrer">
          Partyhat - t.me/partyhat
        </a>
      </p>
    </Partnerships>

    <Footer>
      <br />
      <br />
      <h4>Generic Contacts</h4>
      <p>
        <a
          href="mailto:genericcoin@outlook.com"
          target="_blank"
          rel="noreferrer"
        >
          genericcoin@outlook.com
        </a>
        <br />
        <a
          href="https://twitter.com/thegenericcoin"
          target="_blank"
          rel="noreferrer"
        >
          twitter.com/TheGenericCoin
        </a>
        <br />
        <a href="https://t.me/genericcoin" target="_blank" rel="noreferrer">
          t.me/genericcoin
        </a>
      </p>
    </Footer>
  </WidthLimitedGrid>
);

export default FeedListing;
