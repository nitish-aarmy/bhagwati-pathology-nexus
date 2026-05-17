import React from "react";

const TestSectionEditor = ({ test, onChange }) => (
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
            <td>
              <input
                value={r.parameter}
                onChange={e => onChange(["results", i, "parameter"], e.target.value)}
              />
            </td>
            <td>
              <input
                value={r.value}
                onChange={e => onChange(["results", i, "value"], e.target.value)}
              />
            </td>
            <td>
              <input
                value={r.unit}
                onChange={e => onChange(["results", i, "unit"], e.target.value)}
              />
            </td>
            <td>
              <input
                value={r.reference}
                onChange={e => onChange(["results", i, "reference"], e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TestSectionEditor;
