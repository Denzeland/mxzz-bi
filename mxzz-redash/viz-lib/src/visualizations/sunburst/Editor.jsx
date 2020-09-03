import React from "react";
import { Section } from "@/components/visualizations/editor";

export default function Editor() {
  return (
    <React.Fragment>
      <p>{__("This visualization expects the query result to have rows in one of the following formats")}:</p>
      <Section>
        <p>
          <strong>{__("Option")} 1:</strong>
        </p>
        <ul>
          <li>
            <strong>sequence</strong> - {__("sequence id")}
          </li>
          <li>
            <strong>stage</strong> - {__("what stage in sequence this is (1, 2, ...)")}
          </li>
          <li>
            <strong>node</strong> - {__("stage name")}
          </li>
          <li>
            <strong>value</strong> - {__("number of times this sequence occurred")}
          </li>
        </ul>
      </Section>
      <Section>
        <p>
          <strong>{__("Option")} 2:</strong>
        </p>
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
      </Section>
    </React.Fragment>
  );
}
