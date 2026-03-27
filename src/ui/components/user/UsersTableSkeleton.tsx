import type { CSSProperties } from "react";
import { Skeleton, theme } from "antd";

const USERS_TABLE_COLS = 7;
const SKELETON_ROWS = 8;

export function UsersTableSkeleton() {
  const { token } = theme.useToken();

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      "48px minmax(72px, 1fr) minmax(96px, 1.5fr) 88px 72px minmax(88px, 1fr) minmax(88px, 1fr)",
    columnGap: token.paddingSM,
    alignItems: "center",
  };

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          ...gridStyle,
          padding: `${token.paddingSM}px ${token.padding}px`,
          background: token.colorFillAlter,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          minHeight: 48,
        }}
      >
        {Array.from({ length: USERS_TABLE_COLS }).map((_, i) => (
          <Skeleton.Input
            key={i}
            active
            size="small"
            block
            style={{ height: 16, minWidth: 0 }}
          />
        ))}
      </div>
      {Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            ...gridStyle,
            padding: `${token.paddingSM}px ${token.padding}px`,
            borderBottom:
              rowIdx === SKELETON_ROWS - 1
                ? undefined
                : `1px solid ${token.colorBorderSecondary}`,
            minHeight: 54,
          }}
        >
          {Array.from({ length: USERS_TABLE_COLS }).map((_, colIdx) => (
            <Skeleton.Input
              key={colIdx}
              active
              size="small"
              block
              style={{
                height: 14,
                minWidth: 0,
                width: colIdx === 0 ? 36 : "100%",
                maxWidth: colIdx === 4 ? 56 : undefined,
              }}
            />
          ))}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: token.paddingXS,
          padding: `${token.padding}px`,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Skeleton.Input active style={{ width: 28, height: 32 }} />
        <Skeleton.Input active style={{ width: 120, height: 32 }} />
        <Skeleton.Input active style={{ width: 28, height: 32 }} />
        <Skeleton.Input active style={{ width: 180, height: 24 }} />
      </div>
    </div>
  );
}
