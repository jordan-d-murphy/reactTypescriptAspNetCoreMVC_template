import { useEffect, useState } from "react";
import { QueryBuilder, RuleGroupType } from "react-querybuilder";
import "./styles.scss";

import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import * as ReactDnD from "react-dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";
import type { Classnames, Controls, Field, FullField, Translations, ValueEditorType } from "react-querybuilder";

import { getCompatContextProvider } from "react-querybuilder";
import { ReactNode } from "react";
import { ShadcnUiActionElement } from "./ShadcnUiActionElement";
import { ShadcnUiActionElementIcon } from "./ShadcnUiActionElementIcon";
import { ShadcnUiValueSelector } from "./ShadcnUiValueSelector";
import { Plus, X, Copy, Lock, Unlock, ChevronDown, ChevronUp } from "lucide-react";
import { ShadcnUiDragHandle } from "./ShadcnUiDragHandle";
import { ShadcnUiNotToggle } from "./ShadcnUiNotToggle";
import { ShadcnUiValueEditor } from "./ShadcnUiValueEditor";
import { PresetActions } from "@/pages/dashboard/features/playground/components/preset-actions";
import { PresetSelector } from "@/pages/dashboard/features/playground/components/preset-selector";
import { presets } from "@/pages/dashboard/features/playground/data/presets";
import { DynamicCodeViewer, DynamicCodeViewerType } from "./dynamic-code-viewer";

export const shadcnUiControlClassnames = {
  ruleGroup: "rounded-lg shadow-sm border bg-background p-3 m-3",
} satisfies Partial<Classnames>;

export const shadcnUiControlElements = {
  actionElement: ShadcnUiActionElement,
  removeGroupAction: ShadcnUiActionElementIcon,
  removeRuleAction: ShadcnUiActionElementIcon,
  valueSelector: ShadcnUiValueSelector,
  valueEditor: ShadcnUiValueEditor,
  notToggle: ShadcnUiNotToggle,
  dragHandle: ShadcnUiDragHandle,
} satisfies Partial<Controls<FullField, string>>;

export const shadcnUiTranslations = {
  addRule: {
    label: (
      <>
        <Plus className="w-4 h-4 mr-2" /> Rule
      </>
    ),
  },
  addGroup: {
    label: (
      <>
        <Plus className="w-4 h-4 mr-2" /> Group
      </>
    ),
  },
  removeGroup: { label: <X className="w-4 h-4" /> },
  removeRule: { label: <X className="w-4 h-4" /> },
  cloneRuleGroup: { label: <Copy className="w-4 h-4" /> },
  cloneRule: { label: <Copy className="w-4 h-4" /> },
  lockGroup: { label: <Unlock className="w-4 h-4" /> },
  lockRule: { label: <Unlock className="w-4 h-4" /> },
  lockGroupDisabled: { label: <Lock className="w-4 h-4" /> },
  lockRuleDisabled: { label: <Lock className="w-4 h-4" /> },
  shiftActionDown: { label: <ChevronDown className="w-4 h-4" /> },
  shiftActionUp: { label: <ChevronUp className="w-4 h-4" /> },
} satisfies Partial<Translations>;

const ShadcnContextProvider = getCompatContextProvider({
  controlClassnames: shadcnUiControlClassnames,
  controlElements: shadcnUiControlElements,
  translations: shadcnUiTranslations,
});

const values = [
  { name: "option1", label: "Option 1" },
  { name: "option2", label: "Option 2" },
  { name: "option3", label: "Option 3" },
  { name: "option4", label: "Option 4" },
];

const fields: Field[] = [
  { name: "text", label: "text", inputType: "text", value: "text" },
  {
    name: "select",
    label: "select",
    value: "select",
    valueEditorType: "select" as ValueEditorType,
    values,
  },
  {
    name: "checkbox",
    label: "checkbox",
    value: "checkbox",
    valueEditorType: "checkbox" as ValueEditorType,
  },
  {
    name: "radio",
    label: "radio",
    value: "radio",
    valueEditorType: "radio" as ValueEditorType,
    values,
  },
  {
    name: "textarea",
    label: "textarea",
    value: "textarea",
    valueEditorType: "textarea" as ValueEditorType,
  },
  {
    name: "multiselect",
    label: "multiselect",
    value: "multiselect",
    valueEditorType: "multiselect" as ValueEditorType,
    values,
  },
  { name: "date", label: "date", inputType: "date", value: "date" },
  {
    name: "datetime-local",
    label: "datetime-local",
    inputType: "datetime-local",
    value: "datetime-local",
  },
  { name: "time", label: "time", inputType: "time", value: "time" },
  {
    name: "field",
    label: "field",
    value: "field",
    valueSources: ["field", "value"],
  },
];

export const operators = [
  { name: "=", label: "=" },
  { name: "in", label: "in" },
  { name: "between", label: "between" },
];

export const defaultQuery: RuleGroupType = {
  combinator: "and",
  rules: [
    { field: "text", operator: "=", value: "" },
    { field: "select", operator: "=", value: "option2" },
    { field: "checkbox", operator: "=", value: true },
    { field: "switch", operator: "=", value: true },
    { field: "radio", operator: "=", value: "option2" },
    { field: "textarea", operator: "=", value: "" },
    { field: "multiselect", operator: "in", value: ["option1", "option2"] },
    { field: "date", operator: "=", value: "" },
    { field: "datetime-local", operator: "=", value: "" },
    { field: "time", operator: "=", value: "" },
    { field: "text", operator: "between", value: "A,Z" },
    { field: "select", operator: "between", value: "option2,option4" },
    { field: "field", operator: "=", value: "text", valueSource: "field" },
  ],
};

export const NullComponent = () => null;

export default function BuilderPage({ children }: { children?: ReactNode }) {
  const [query, setQuery] = useState<RuleGroupType>(defaultQuery);

  // export to json
  // const configJson = JSON.stringify(query, null, 2);

  // import from json
  // const configJson = JSON.stringify(query, null, 2);
  // const importedQuery = JSON.parse(configJson);

  useEffect(() => {
    console.log("Updated query:", query);
  }, [query]);

  return (
    <>
      <h1>title from: react-querybuilder-shadcn-ui/page.tsx fn: BuilderPage</h1>

      <div className="ml-auto flex w-full space-x-2 sm:justify-end p-3 m-3">
        <PresetSelector presets={presets} />
        <div className="hidden space-x-2 md:flex">
          <DynamicCodeViewer type={DynamicCodeViewerType.from_config} query={JSON.stringify(query, null, 2)} />
          <DynamicCodeViewer type={DynamicCodeViewerType.save_export} query={JSON.stringify(query, null, 2)} />
        </div>
        <PresetActions />
      </div>

      <ShadcnContextProvider>
        <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
          <QueryBuilder
            controlClassnames={{ queryBuilder: "queryBuilder-branches" }}
            fields={fields}
            showNotToggle
            defaultQuery={query}
            onQueryChange={setQuery}
          />
        </QueryBuilderDnD>
      </ShadcnContextProvider>
    </>
  );
}
