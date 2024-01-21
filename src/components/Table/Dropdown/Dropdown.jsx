// import "./TableRow.css";

const Dropdown = ({ onChange }) => {
  return (
    <select onChange={onChange}>
      <option value="reset">No sorting</option>
      <option value="ascend">Sort in ascending order</option>
      <option value="descend">Sort in descending order</option>
    </select>
  );
};

export default Dropdown;
