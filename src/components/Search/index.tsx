import { CiSearch } from "react-icons/ci";
import { Heading } from "@radix-ui/themes";
import styled from "styled-components";

type Props = {
  industries: string[];
  setSearchTerm: (searchTerm: string) => void;
  industryFilter: string;
  setIndustryFilter: (industry: string) => void;
};

const SearchComponent = ({
  setSearchTerm,
  setIndustryFilter,
  industryFilter,
  industries,
}: Props) => {
  const selectOptions = industries.map((industry) => {
    return { label: industry, value: industry };
  });

  return (
    <Wrapper>
      <Heading style={{ padding: "0rem 0rem 1rem 0.5rem" }}>
        Search for your next stock.
      </Heading>
      <FilterWrapper>
        <StyledInputContainer>
          <StyledInputArea>
            <StyledLabel htmlFor="search">Company Name</StyledLabel>
            <StyledInput
              name="search"
              type="search"
              aria-label="Search by name"
              placeholder="Name"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </StyledInputArea>
          <StyledIconContainer>
            <CiSearch />
          </StyledIconContainer>
        </StyledInputContainer>
        <IndustryContainer>
          <StyledLabel htmlFor="industry">Filter by Industry</StyledLabel>
          <StyledSelect
            name="industry"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </StyledSelect>
        </IndustryContainer>
      </FilterWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  padding: 1rem 0;
  margin: 1rem 0;
  border-radius: 0.55rem;
  display: flex;
  flex-direction: column;
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(100% - 1rem);
  padding: 0 0.5rem;
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.15rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.25rem;
  padding: 0.25rem;
  width: 70%;
`;

const StyledInputArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  gap: 0.25rem;
`;

const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-left: 1px solid #e5e5e5;
  width: 10%;
`;

const StyledLabel = styled.label`
  font-size: 0.75em;
`;

const StyledInput = styled.input`
  border: none;
  outline: none;
`;

const IndustryContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 0.5rem;
  border: 1px solid #e5e5e5;
  border-left: none;

  & label {
    padding: 0.25rem 0 0 0.25rem;
  }
`;

const StyledSelect = styled.select`
  border: none;
  outline: none;
  padding-top: 0.25rem;
`;

export default SearchComponent;
