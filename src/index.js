import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import createRowData from "./createRowData";
import data from "./data";
// import "./styles.css";

const defaultColumnProperties = {
  filterable: true,
  width: 250,
  resizable: true
};
const tickFormatter = ({ value }) =>
  value.includes("true") ? <div>yes</div> : <div>no</div>;
const selectors = Data.Selectors;
const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter
} = Filters;
const columns = [
  {
    key: "user",
    name: "user",
    filterRenderer: AutoCompleteFilter,
    filterable: true,
    width: 250,
    resizable: true
  },
  ...data
    .map((col) => {
      return {
        key: col.tool_id + " - " + col.name,
        name: col.tool_id + " - " + col.name,
        filterRenderer: MultiSelectFilter,
        formatter: tickFormatter
      };
    })
    .map((c) => ({ ...c, ...defaultColumnProperties }))
];

const ROW_COUNT = 50;

const handleFilterChange = (filter) => (filters) => {
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

function getValidFilterValues(rows, columnId) {
  return rows
    .map((r) => r[columnId])
    .filter((item, i, a) => {
      return i === a.indexOf(item);
    });
}

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}

function Example() {
  const rows = [
    {
      "mattermost - Test Users Tab": "false",
      "jira - test234": "true",
      user: "Petr Sokolov",
      "sentry - Test Users Tab": "false",
      "gitlab - Test Users Tab": "false",
      "jira - teter": "false",
      "jira - fdgdfg": "false",
      "jira - sdfsdf": "false",
      "jira - tryrytry": "true",
      "jira - hrryryy": "false",
      "jira - tetet": "true"
    },
    {
      "mattermost - Test Users Tab": "false",
      "jira - test234": "true",
      user: "Sai Gudla",
      "sentry - Test Users Tab": "false",
      "gitlab - Test Users Tab": "false",
      "jira - teter": "false",
      "jira - fdgdfg": "false",
      "jira - sdfsdf": "false",
      "jira - tryrytry": "false",
      "jira - hrryryy": "false",
      "jira - tetet": "false"
    },
    {
      "mattermost - Test Users Tab": "false",
      "jira - test234": "false",
      "sentry - Test Users Tab": "false",
      "gitlab - Test Users Tab": "false",
      "jira - teter": "false",
      "jira - fdgdfg": "false",
      "jira - sdfsdf": "false",
      "jira - tryrytry": "true",
      user: "Mhmd Shaban",
      "jira - hrryryy": "false",
      "jira - tetet": "true"
    }
  ];

  const [filters, setFilters] = useState({});
  const filteredRows = getRows(rows, filters);
  return (
    <ReactDataGrid
      columns={columns}
      rowGetter={(i) => filteredRows[i]}
      rowsCount={filteredRows.length}
      minHeight={500}
      onAddFilter={(filter) => setFilters(handleFilterChange(filter))}
      onClearFilters={() => setFilters({})}
      getValidFilterValues={(columnKey) =>
        getValidFilterValues(rows, columnKey)
      }
    />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Example rows={createRowData(50)} />, rootElement);
