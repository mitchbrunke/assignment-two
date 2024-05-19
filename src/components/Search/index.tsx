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
    <div>
      <input
        type="search"
        placeholder="Search by name"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <select
        value={industryFilter}
        onChange={(e) => setIndustryFilter(e.target.value)}
      >
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchComponent;
