"use client";

import { Children, cloneElement, isValidElement } from "react";
import type { ReactNode } from "react";
import { translateLoose, type Locale } from "@/lib/i18n";

type LocalizedTreeProps = {
  locale: Locale;
  children: ReactNode;
};

const textPropKeys = new Set([
  "title",
  "subtitle",
  "label",
  "placeholder",
  "description",
  "hint",
  "alt",
  "aria-label",
  "ariaLabel",
]);

function localizeNode(node: ReactNode, locale: Locale): ReactNode {
  if (typeof node === "string") {
    return translateLoose(locale, node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => localizeNode(child, locale));
  }

  if (!isValidElement(node)) {
    return node;
  }

  const props = (node.props ?? {}) as Record<string, unknown>;
  const nextProps: Record<string, unknown> = {};
  let hasPropChange = false;

  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue;
    if (typeof value === "string" && textPropKeys.has(key)) {
      nextProps[key] = translateLoose(locale, value);
      hasPropChange = true;
      continue;
    }
    nextProps[key] = value;
  }

  const hasChildren = Object.prototype.hasOwnProperty.call(props, "children");
  const localizedChildren = hasChildren ? localizeNode(props.children as ReactNode, locale) : undefined;

  if (hasChildren || hasPropChange) {
    return cloneElement(node, nextProps, localizedChildren);
  }

  return node;
}

export default function LocalizedTree({ locale, children }: LocalizedTreeProps) {
  const localized = Children.map(children, (child) => localizeNode(child, locale));

  return <>{localized}</>;
}
