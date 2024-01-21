const TableRow = ({ user, onClick }) => {
  return (
    <tr onClick={onClick}>
      <td>
        <span>
          {user.firstName} {user.lastName} {user.maidenName}
        </span>
      </td>
      <td>
        <span>{user.age}</span>
      </td>
      <td>
        <span>{user.gender}</span>
      </td>
      <td>
        <span>{user.phone}</span>
      </td>
      <td>
        <span>
          {user.address.address}, {user.address.city}
        </span>
      </td>
    </tr>
  );
};

export default TableRow;
