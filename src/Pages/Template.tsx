import * as Avatar from "@radix-ui/react-avatar";

import React from "react";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

const Template = ({ children }: Props) => {
  return (
    <PageWrapper>
      <StyledTopBarWrapper>
        <h3>StockFinder</h3>
        <AvatarRoot>
          <AvatarImage
            src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
            alt="Pedro Duarte"
          />
          <AvatarFallback delayMs={600}>MB</AvatarFallback>
        </AvatarRoot>
      </StyledTopBarWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </PageWrapper>
  );
};

export default Template;

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const StyledTopBarWrapper = styled.div`
  background-color: #ffffff;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  border-bottom: 1px solid #e5e5e5;
  & h3 {
    padding-left: 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  background-color: rgba(244, 247, 250, 1);
  height: 100%;
  overflow-y: scroll;
`;

const AvatarRoot = styled(Avatar.Root)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  width: 45px;
  height: 45px;
  border-radius: 100%;
  margin-right: 1rem;
  background-color: var(--black-a3);
`;

const AvatarImage = styled(Avatar.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

const AvatarFallback = styled(Avatar.Fallback)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e5e5;
  color: black;
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
`;
