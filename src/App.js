import { useEffect, useState } from "react";
import { Table } from "react-infinite-table";
import "react-infinite-table/dist/style.css";
import './App.scss';
const columnData = require('./data/column.json');

function createAllRows() {
  const rows = [];
  for (let index = 0; index < 30; index++) {
    rows.push({ i: rows.length });
  }
  return rows;
}

function recreateRows(infiniteScrolling) {
  let rows;
  if (infiniteScrolling) {
    rows = [];
    for (let index = 0; index < 30; index++) {
      rows.push({ i: rows.length });
    }
  } else {
    rows = createAllRows();
  }
  return rows;
}

function App() {
  const [rows, setRows] = useState(createAllRows());
  const [columns, setColumns] = useState([]);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

  useEffect(() => {
    const data = generateColumns();
    setColumns(data);
  }, []);

  function generateColumns() {
    const data = [];
    columnData.forEach((col) => {
      data.push({
        name: col.name,
        width: col.width,
        headerRenderer: headerRenderer,
        cellRenderer: cellRenderer
      })
    });
    return data;
  }

  function headerRenderer({ columnIndex, column, className }) {
    return (
      <th key={columnIndex} className={className}>
        {column.name}
      </th>
    );
  }

  function cellRenderer({ columnIndex, column, rowData, rowIndex, className }) {
    return (
      <td key={rowIndex} className={className}>
        Row: {rowIndex}
      </td>
    );
  }

  const onInfiniteScrolling = (infiniteScroll) => {
    const rows = recreateRows(infiniteScroll);

    setRows(rows);
    setIsInfiniteLoading(false);
  };

  const onInfiniteLoad = () => {
    console.log("Loading new rows!");
    setIsInfiniteLoading(true);
    setTimeout(() => {
      const data = [...rows];

      for (let index = 0; index < 10; index++) {
        data.push({ i: data.length });
      }

      setRows(data);
      setIsInfiniteLoading(false);
    }, 2000);
  };

  return (
    <div className="App">
      <div className='container'>
        <h1>Transactions</h1>
        <Table
          className="app-table"
          height={800}
          rowHeight={40}
          rows={rows}
          columns={columns}
          noRowsRenderer={() => "No rows"}
          infiniteLoadBeginEdgeOffset={150}
          isInfiniteLoading={isInfiniteLoading}
          onInfiniteLoad={onInfiniteLoad}
          getLoadingSpinner={() => <div>Loading...</div>}
        />
      </div>
    </div>
  );
}

export default App;
