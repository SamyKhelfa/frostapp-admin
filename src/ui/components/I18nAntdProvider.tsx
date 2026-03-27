import type { ReactNode } from "react";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import frFR from "antd/locale/fr_FR";
import { useTranslation } from "react-i18next";

export function I18nAntdProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("en") ? enUS : frFR;
  return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
}
