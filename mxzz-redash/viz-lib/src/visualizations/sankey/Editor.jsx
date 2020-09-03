import React from "react";

export default function Editor() {
  return (
    <React.Fragment>
      <p>{__("This visualization expects the query result to have rows in the following format")}:</p>
      <ul>
        <li>
          <strong>stage1</strong> - {__("stage 1 value")}
        </li>
        <li>
          <strong>stage2</strong> - {__("stage 2 value (or null)")}
        </li>
        <li>
          <strong>stage3</strong> - {__("stage 3 value (or null)")}
        </li>
        <li>
          <strong>stage4</strong> - {__("stage 4 value (or null)")}
        </li>
        <li>
          <strong>stage5</strong> - {__("stage 5 value (or null)")}
        </li>
        <li>
          <strong>value</strong> - {__("number of times this sequence occurred")}
        </li>
      </ul>
    </React.Fragment>
  );
}
