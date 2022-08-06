import { useEffect, useState } from "react";
import { Table } from "react-infinite-table";
import TimeAgo from "react-timeago";
import LoadingSpin from "react-loading-spin";
import "react-infinite-table/dist/style.css";
import "./App.scss";
import { useTransaction } from "./hooks/useTransaction";
import { financial, shortenAddress } from "./utils";
import refreshIcon from "./assets/refreshIcon.svg";
const columnData = require("./data/column.json");

const DECIMALS = 1000000;
const WATCH_WALLET = "TSaJqQ1AZ2bEYyqBwBmJqCBSPv8KPRTAdv";

function App() {
  const [rows, setRows] = useState([]);
  const [fingerprint, setFingerPrint] = useState(null);
  const [columns, setColumns] = useState([]);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const { getTransactions } = useTransaction();

  useEffect(() => {
    const data = generateColumns();
    setColumns(data);
    generateTransactions(fingerprint);
  }, []);

  function generateColumns() {
    const data = [];
    columnData.forEach((col) => {
      data.push({
        name: col.name,
        width: col.width,
        headerRenderer: headerRenderer,
        cellRenderer: cellRenderer,
      });
    });
    return data;
  }

  const generateTransactions = (finger) => {
    setIsInfiniteLoading(true);
    getTransactions(finger).then((res) => {
      if (finger) {
        const data = [...rows, ...res.data];
        setRows(data);
      } else {
        setRows(res.data);
      }
      setFingerPrint(res.fingerprint);
      setIsInfiniteLoading(false);
    });
  };

  function headerRenderer({ columnIndex, column, className }) {
    return (
      <th key={columnIndex} className={className}>
        {column.name}
      </th>
    );
  }

  function cellRenderer({ columnIndex, column, rowData, rowIndex, className }) {
    if (columnIndex === 0) {
      return (
        <td key={columnIndex} className={className}>
          <a
            href={`https://tronscan.org/#/transaction/${rowData.transaction_id}`}
            target="_blank"
            rel="noreferrer"
          >
            {shortenAddress(rowData.transaction_id, 6)}
          </a>
        </td>
      );
    } else if (columnIndex === 1) {
      return (
        <td key={columnIndex} className={className}>
          <TimeAgo date={new Date(rowData.block_timestamp)} />
        </td>
      );
    } else if (columnIndex === 2) {
      return (
        <td key={columnIndex} className={className}>
          {rowData.type}
        </td>
      );
    } else if (columnIndex === 3) {
      return (
        <td key={columnIndex} className={className}>
          {rowData.from === WATCH_WALLET ? (
            shortenAddress(rowData.from, 5)
          ) : (
            <a
              href={`https://tronscan.org/#/address/${rowData.from}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortenAddress(rowData.from, 5)}
            </a>
          )}
        </td>
      );
    } else if (columnIndex === 4) {
      return (
        <td key={columnIndex} className={className}>
          {rowData.to === WATCH_WALLET ? (
            shortenAddress(rowData.to, 5)
          ) : (
            <a
              href={`https://tronscan.org/#/address/${rowData.to}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortenAddress(rowData.to, 5)}
            </a>
          )}
        </td>
      );
    } else if (columnIndex === 5) {
      return (
        <td key={columnIndex} className={className}>
          {financial(Number(rowData.value) / DECIMALS, 5)}{" "}
          <a
            href="https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
            target="_blank"
            rel="noreferrer"
          >
            USDT
          </a>
        </td>
      );
    } else if (columnIndex === 6) {
      return (
        <td key={columnIndex} className={className}>
          CONFIRMED
        </td>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Transactions</h1>
        <div className="app-content">
          <a href={`https://tronscan.org/#/address/${WATCH_WALLET}`}>
            {WATCH_WALLET}
          </a>
          <div className="refresh-btn">
            {isInfiniteLoading ? (
              <LoadingSpin size="22px" width="1px" primaryColor="#333" />
            ) : (
              <img src={refreshIcon} alt="refresh" className="refresh-icon" onClick={() => generateTransactions(null)}/>
            )}
          </div>
        </div>
        <Table
          className="app-table"
          height={600}
          rowHeight={40}
          rows={rows}
          columns={columns}
          noRowsRenderer={() => "No rows"}
          infiniteLoadBeginEdgeOffset={150}
          isInfiniteLoading={isInfiniteLoading}
          onInfiniteLoad={() => generateTransactions(fingerprint)}
          getLoadingSpinner={() => <div>Loading...</div>}
        />
      </div>
    </div>
  );
}

export default App;
