import { useState } from "react";
import { QueryBuilder, RuleGroupType } from "react-querybuilder";
import QueryBuilderShadcnUi from "@/components/react-querybuilder-shadcn-ui/page";

import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import * as ReactDnD from "react-dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";

const fields = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
];

export default function QueryBuilderPage() {
  console.log("called from: export default function QueryBuilderPage() {... in /dashboard/features/query/.page.tsx");
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });

  return (
    <>
      <h1>title from: query/page.tsx fn: QueryBuilderPage</h1>
      <QueryBuilderShadcnUi>
        <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
          <QueryBuilder
            controlClassnames={{ queryBuilder: "queryBuilder-branches" }}
            fields={fields}
            showNotToggle
            defaultQuery={query}
          />
        </QueryBuilderDnD>
      </QueryBuilderShadcnUi>
    </>
  );
}
