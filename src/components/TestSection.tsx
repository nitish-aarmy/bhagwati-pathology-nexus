import React from "react";

const TestSection = ({ test }) => (
  <div className="test-section">
    <h3 className="test-title">=== {test.name.toUpperCase()} ===</h3>
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Result</th>
          <th>Unit</th>
          <th>Reference</th>
        </tr>
      </thead>
      <tbody>
        {test.results.map((r, i) => (
          <tr key={i}>
            <td>{r.parameter}</td>
            <td>{r.value}</td>
            <td>{r.unit}</td>
            <td>{r.reference}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TestSection;
