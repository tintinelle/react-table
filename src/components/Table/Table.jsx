import TableRow from "./TableRow/TableRow";
import Search from "./Search/Search";
import { useState, useEffect, useRef, useCallback } from "react";
import "./Table.css";
import ModalWindow from "./ModalWindow/ModalWindow";
import Dropdown from "./Dropdown/Dropdown";

const tableHeaders = ["Name", "Age", "Gender", "Phone", "Address"];
const tableHeadersPropertyNames = [
  "firstName",
  "age",
  "gender",
  "phone",
  "address.city",
];

const createHeaders = (headers) => {
  return headers.map((item) => ({
    text: item,
    ref: useRef(),
  }));
};

const Table = () => {
  const [users, setUsers] = useState([]);
  const [userModal, setUserModal] = useState();
  const [value, setValue] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // Изменение ширины столбцов
  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef(null);
  const columns = createHeaders(tableHeaders);
  // Сортировка
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortedFlag, setSortedFlag] = useState(false);

  // При клике на колонку задаем индекс активного столбца
  const mouseDown = (index) => {
    setActiveIndex(index);
    console.log(columns);
  };

  // Изменение ширины столбца при перетаскивании мышью
  const mouseMove = useCallback(
    (e) => {
      const gridColumns = columns.map((col, i) => {
        if (i === activeIndex) {
          // Считаем ширину активного столбца
          const width = e.clientX - col.ref.current.offsetLeft;
          if (width >= 50) {
            return `${width}px`;
          }
        }
        // Если ширина меньше 50px, возвращаем прыдыдущее значение
        return `${col.ref.current.offsetWidth}px`;
      });

      // Применяем новые стили grid-template-columns
      tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
        " "
      )}`;
    },
    [activeIndex, columns]
  );

  // Убираем слушателей клика
  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  // При отпускании кнопки мыши убираем индекс активного столбца и слушателей
  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  // Загружаем список пользователей
  const getUsers = async (url) => {
    await fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setError("Unable to get the users list.");
        }
      })
      .then((response) => {
        setUsers(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  };

  // Отправляем загружать либо весь список пользователей либо по поиску
  useEffect(() => {
    let url;
    setError(null);
    value
      ? (url = `https://dummyjson.com/users/search?q=${value}`)
      : (url = "https://dummyjson.com/users");
    getUsers(url);
  }, [value]);

  // Считаем высоту бордера столбца
  useEffect(() => {
    setTableHeight(tableElement.current.offsetHeight);
  });

  // Вешаем слушателей, если столбец активен
  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }
    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  // Сортировка
  const sortUsers = (property, criterion) => {
    let sortedData;
    setSortedFlag(true);

    if (criterion === "ascend") {
      sortedData = [...users.users].sort((a, b) =>
        a[property] < b[property] ? -1 : 1
      );
      setSortedUsers(sortedData);
    }
    if (criterion === "descend") {
      sortedData = [...users.users].sort((a, b) =>
        a[property] < b[property] ? 1 : -1
      );
      setSortedUsers(sortedData);
    }
    if (criterion === "reset") {
      setSortedFlag(false);
    }
  };

  return (
    <>
      <Search
        value={value}
        onChange={(event) => setValue(event.target.value)}
      ></Search>

      {userModal && (
        <ModalWindow user={userModal} onClick={() => setUserModal()} />
      )}
      {error ? (
        <div> {error} Try again later!</div>
      ) : (
        <div className={"table-wrapper"}>
          <table className={"table"} ref={tableElement}>
            <thead>
              <tr>
                {/* Отрисовываем заголовки таблицы */}
                {columns &&
                  columns.map(({ ref, text }, i) => (
                    <th ref={ref} key={text}>
                      <span>{text}</span>
                      {text !== "Phone" && (
                        <Dropdown
                          onChange={(e) =>
                            sortUsers(
                              tableHeadersPropertyNames[i],
                              e.target.value
                            )
                          }
                        />

                        // <select
                        //   onChange={(e) =>
                        //     sortUsers(
                        //       tableHeadersPropertyNames[i],
                        //       e.target.value
                        //     )
                        //   }
                        // >
                        //   <option value="reset">No sorting</option>
                        //   <option value="ascend">
                        //     Sort in ascending order
                        //   </option>
                        //   <option value="descend">
                        //     Sort in descending order
                        //   </option>
                        // </select>
                      )}
                      <div
                        style={{ height: tableHeight }}
                        onMouseDown={() => mouseDown(i)}
                        className={`resize-handle ${
                          activeIndex === i ? "active" : ""
                        }`}
                      ></div>
                    </th>
                  ))}
              </tr>
            </thead>

            {/* Если идет загрузка, показываем это пользователю, если все загрузилось, выводим body таблицы */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <tbody>
                {/* Проверяем, что отрисовать: отсортированный список или изначальный */}
                {!sortedFlag
                  ? users.users &&
                    users.users.map((user) => (
                      <TableRow
                        key={user.id}
                        user={user}
                        onClick={() => setUserModal(user)}
                      />
                    ))
                  : sortedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        user={user}
                        onClick={() => setUserModal(user)}
                      />
                    ))}
              </tbody>
            )}
          </table>
        </div>
      )}
    </>
  );
};

export default Table;
