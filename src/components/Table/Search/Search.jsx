const Search = ({ value, onChange }) => {
  return (
    <>
      <h3>Search users:</h3>
      <input onChange={onChange} />
    </>
  );
};

export default Search;
