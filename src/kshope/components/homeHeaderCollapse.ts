export const COLLAPSE_FADE = 0.55;

export interface CollapseMetrics {
  titleHeight: number;
  panelHeight: number;
}

export interface CollapseState {
  titleHeight: number | null;
  titleOpacity: number;
  panelHeight: number | null;
  panelOpacity: number;
}

export const collapseDistance = (metrics: CollapseMetrics): number => {
  'worklet';
  return metrics.titleHeight + metrics.panelHeight;
};

export const collapseHeader = (
  scrollY: number,
  metrics: CollapseMetrics,
): CollapseState => {
  'worklet';
  const { titleHeight, panelHeight } = metrics;

  const rowAt = (span: number, start: number) => {
    if (span <= 0) return { height: null, opacity: 1 };
    const progress = Math.min(1, Math.max(0, (scrollY - start) / span));
    return {
      height: span * (1 - progress),
      opacity: Math.min(1, Math.max(0, 1 - progress / COLLAPSE_FADE)),
    };
  };

  const title = rowAt(titleHeight, 0);
  const panel = rowAt(panelHeight, titleHeight);

  return {
    titleHeight: title.height,
    titleOpacity: title.opacity,
    panelHeight: panel.height,
    panelOpacity: panel.opacity,
  };
};

export const collapseProgress = (
  scrollY: number,
  metrics: CollapseMetrics,
): number => {
  'worklet';
  const distance = collapseDistance(metrics);
  if (distance <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / distance));
};

export interface ActionsState {
  width: number | null;
  opacity: number;
}

export const collapseActions = (
  scrollY: number,
  metrics: CollapseMetrics,
  width: number,
): ActionsState => {
  'worklet';
  if (width <= 0) return { width: null, opacity: 1 };

  const progress = collapseProgress(scrollY, metrics);
  return {
    width: width * (1 - progress),
    opacity: Math.min(1, Math.max(0, 1 - progress / COLLAPSE_FADE)),
  };
};

export interface SectionSizes {
  title: number;
  pinned: number;
  panel: number;
  actions: number;
}

export const freezeSize = (
  prev: SectionSizes,
  key: keyof SectionSizes,
  measured: number,
): SectionSizes => {
  if (measured <= 0 || prev[key] > 0) return prev;
  return { ...prev, [key]: measured };
};
