import React from "react";
import styled from "styled-components";
import { Fieldset, Hourglass } from "react95-native";

import { useConfig } from "gatsby-theme-advanced";

import * as S from "./style";
import GenericLogo from "/themes/advanced/static/logos/logo-192.png";

import ExamplePanel from "../util/ExamplePanel";

const TitleWrap = styled.div`
  img {
    float: left;
    width: 3.9rem;
    margin-right: 1rem;
  }
  p {
    float: left;
    font-style: italic;
    font-size: 4rem;
    color: #2e6af3;
  }
`;

const HourglassExample = () => {
  return (
    <ExamplePanel>
      <Fieldset label="Default:">
        <Hourglass />
      </Fieldset>
      <Fieldset label="Custom size:">
        <Hourglass size={65} />
      </Fieldset>
    </ExamplePanel>
  );
};

const Navigation = (): JSX.Element => {
  const config = useConfig();

  return (
    <S.Wrapper>
      <S.HomeButton to="/">
        <TitleWrap>
          <img src={GenericLogo} alt="" />
          <S.SiteTitle>{config.website.titleShort}</S.SiteTitle>
          <HourglassExample></HourglassExample>
        </TitleWrap>
      </S.HomeButton>
    </S.Wrapper>
  );
};

export default Navigation;
