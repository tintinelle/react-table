import "./Search.css";

const Search = ({ onChange }) => {
  return (
    <div className="search__wrapper">
      <h3 className="search__title">Search users by name:</h3>
      <input onChange={onChange} />
    </div>
  );
};

export default Search;
