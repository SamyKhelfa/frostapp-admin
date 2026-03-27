import type { CSSProperties } from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

const options = [
  { value: "fr", labelKey: "language.fr" as const },
  { value: "en", labelKey: "language.en" as const },
];

export function LanguageSwitcher({ style }: { style?: CSSProperties }) {
  const { i18n, t } = useTranslation();
  return (
    <Select
      value={i18n.language.startsWith("en") ? "en" : "fr"}
      style={{ minWidth: 120, ...style }}
      variant="outlined"
      options={options.map((o) => ({
        value: o.value,
        label: t(o.labelKey),
      }))}
      onChange={(lng) => void i18n.changeLanguage(lng)}
    />
  );
}
