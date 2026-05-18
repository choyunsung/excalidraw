import { MainMenu } from "@excalidraw/excalidraw/index";
import { useExcalidrawSetAppState } from "@excalidraw/excalidraw/components/App";
import { FONT_FAMILY, ROUGHNESS, STROKE_WIDTH } from "@excalidraw/common";
import { palette, FreedrawIcon } from "@excalidraw/excalidraw/components/icons";
import React from "react";

import type { JSX } from "react";

import type { AppState } from "@excalidraw/excalidraw/types";

type PresetValues = Pick<
  AppState,
  | "currentItemFontFamily"
  | "currentItemFontSize"
  | "currentItemRoughness"
  | "currentItemRoundness"
  | "currentItemStrokeStyle"
  | "currentItemStrokeWidth"
  | "currentItemFillStyle"
>;

type StylePreset = {
  id: string;
  label: string;
  values: PresetValues;
};

const PRESETS: StylePreset[] = [
  {
    id: "handwriting",
    label: "손글씨",
    values: {
      currentItemFontFamily: FONT_FAMILY.Excalifont,
      currentItemFontSize: 20,
      currentItemRoughness: ROUGHNESS.artist,
      currentItemRoundness: "round",
      currentItemStrokeStyle: "solid",
      currentItemStrokeWidth: STROKE_WIDTH.thin,
      currentItemFillStyle: "hachure",
    },
  },
  {
    id: "clean",
    label: "깔끔",
    values: {
      currentItemFontFamily: FONT_FAMILY.Helvetica,
      currentItemFontSize: 20,
      currentItemRoughness: ROUGHNESS.architect,
      currentItemRoundness: "sharp",
      currentItemStrokeStyle: "solid",
      currentItemStrokeWidth: STROKE_WIDTH.bold,
      currentItemFillStyle: "solid",
    },
  },
  {
    id: "sketchy",
    label: "스케치",
    values: {
      currentItemFontFamily: FONT_FAMILY["Comic Shanns"],
      currentItemFontSize: 20,
      currentItemRoughness: ROUGHNESS.cartoonist,
      currentItemRoundness: "round",
      currentItemStrokeStyle: "solid",
      currentItemStrokeWidth: STROKE_WIDTH.thin,
      currentItemFillStyle: "hachure",
    },
  },
  {
    id: "code",
    label: "코드",
    values: {
      currentItemFontFamily: FONT_FAMILY.Cascadia,
      currentItemFontSize: 18,
      currentItemRoughness: ROUGHNESS.architect,
      currentItemRoundness: "sharp",
      currentItemStrokeStyle: "solid",
      currentItemStrokeWidth: STROKE_WIDTH.bold,
      currentItemFillStyle: "solid",
    },
  },
  {
    id: "marker",
    label: "마커",
    values: {
      currentItemFontFamily: FONT_FAMILY.Excalifont,
      currentItemFontSize: 24,
      currentItemRoughness: ROUGHNESS.artist,
      currentItemRoundness: "round",
      currentItemStrokeStyle: "solid",
      currentItemStrokeWidth: STROKE_WIDTH.extraBold,
      currentItemFillStyle: "solid",
    },
  },
];

const PRESET_ICONS: Record<string, JSX.Element> = {
  handwriting: FreedrawIcon,
  clean: palette,
  sketchy: FreedrawIcon,
  code: palette,
  marker: palette,
};

export const StylePresets = React.memo(() => {
  const setAppState = useExcalidrawSetAppState();

  if (!setAppState) {
    return null;
  }

  const applyPreset = (preset: StylePreset) => {
    setAppState((prev) => ({ ...prev, ...preset.values }));
  };

  return (
    <MainMenu.Sub>
      <MainMenu.Sub.Trigger icon={palette}>스타일 프리셋</MainMenu.Sub.Trigger>
      <MainMenu.Sub.Content>
        {PRESETS.map((preset) => (
          <MainMenu.Item
            key={preset.id}
            icon={PRESET_ICONS[preset.id]}
            onSelect={() => applyPreset(preset)}
          >
            {preset.label}
          </MainMenu.Item>
        ))}
      </MainMenu.Sub.Content>
    </MainMenu.Sub>
  );
});

StylePresets.displayName = "StylePresets";
