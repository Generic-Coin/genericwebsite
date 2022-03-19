import styled, { css } from "styled-components";

type CardStyleProps = { hero?: boolean };

export const Folder = styled.span`
  & img {
    margin-right: 0.4rem;
    margin-bottom: -0.25rem;
  }
`;

export const Details = styled.div<CardStyleProps>`
  display: grid;

  ${({ hero }) =>
    hero &&
    css`
      @media (min-width: var(--breakpoint-lg)) {
        align-content: space-between;
      }
    `}
`;
