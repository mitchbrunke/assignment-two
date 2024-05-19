import LoadingIcon from "/src/assets/loader.svg";
import React from "react";
import styled from "styled-components";

const Loader: React.FC = () => {
  return <StyledLoader />;
};

const StyledLoader = styled(LoadingIcon)`
  width: 100px;
  height: 100px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
