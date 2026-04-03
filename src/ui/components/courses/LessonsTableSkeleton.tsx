import type { CSSProperties } from "react";
import { Skeleton, theme } from "antd";

const LESSONS_TABLE_COLS = 5;
const SKELETON_ROWS = 8;

export function LessonsTableSkeleton() {
  const { token } = theme.useToken();

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      "48px minmax(72px, 1fr) minmax(96px, 1.5fr) 88px minmax(88px, 1fr)",
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
        {Array.from({ length: LESSONS_TABLE_COLS }).map((_, i) => (
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
          {Array.from({ length: LESSONS_TABLE_COLS }).map((_, colIdx) => (
            <Skeleton.Input
              key={colIdx}
              active
              size="small"
              block
              style={{ height: 16, minWidth: 0 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
