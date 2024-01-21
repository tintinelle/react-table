import "./ModalWindow.css";

const ModalWindow = ({ user, onClick }) => {
  return (
    <div className="wrapper">
      <div className="modal-window">
        <button className="modal-window__close" onClick={onClick}>
          X
        </button>
        <p>
          User:{" "}
          <span>
            {user.firstName} {user.lastName} {user.maidenName}{" "}
          </span>
        </p>
        <p>
          Age: <span>{user.age} years</span>
        </p>
        <p>
          Address:{" "}
          <span>
            {user.address.address}, {user.address.city}{" "}
          </span>
        </p>
        <p>
          Height: <span>{user.height} cm</span>
        </p>
        <p>
          Weight: <span>{user.weight} kg</span>
        </p>
        <p>
          Phone: <span>{user.phone}</span>
        </p>
        <p>
          Email: <span>{user.email}</span>
        </p>
      </div>
    </div>
  );
};

export default ModalWindow;
