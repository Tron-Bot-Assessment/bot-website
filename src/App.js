import { useState } from "react";
import { Table } from "react-infinite-table";
import "react-infinite-table/dist/style.css";
import './App.css';

function cellRenderer({
  key,
  columnIndex,
  column,
  rowData,
  rowIndex,
  className
}) {
  return (
    <td key={key} className={className}>
      R:{rowData.i} C:{column.i}
    </td>
  );
}

function headerRenderer({ key, columnIndex, column, className }) {
  return (
    <th key={key} className={className}>
      C:{column.i}
    </th>
  );
}

const _columns = [];

for (let index = 0; index < 30; index++) {
  _columns.push({
    i: index,
    cellRenderer: cellRenderer,
    headerRenderer: headerRenderer,
    width: 90
  });
}

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
  const [columns, setColumns] = useState(_columns);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

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
        <Table
          className="app-table"
          height={800}
          rowHeight={30}
          rows={rows}
          columns={columns}
          fixedColumnsLeftCount={1}
          headerCount={1}
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
