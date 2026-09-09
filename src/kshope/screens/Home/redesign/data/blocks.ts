const parseIfJson = (value: any) => {
  if (
    typeof value === 'string' &&
    (value.trim().startsWith('{') || value.trim().startsWith('['))
  ) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

export const unwrapBlock = (block: any): any => {
  if (!block) {
    return null;
  }

  let current = block;
  for (let i = 0; i < 3; i++) {
    const next = parseIfJson(current);
    if (next === current) {
      break;
    }
    current = next;
  }

  if (current && typeof current === 'object') {
    if (current.firstProductBlock) current = current.firstProductBlock;
    else if (current.FirstProductBlock) current = current.FirstProductBlock;
    else if (current.secondProductBlock) current = current.secondProductBlock;
    else if (current.SecondProductBlock) current = current.SecondProductBlock;
    else if (current.thirdProductBlock) current = current.thirdProductBlock;
    else if (current.ThirdProductBlock) current = current.ThirdProductBlock;
    else if (current.data && !current.items && !current.Items)
      current = current.data;

    current = parseIfJson(current);
  }

  return current;
};

export const getItems = (block: any): any[] => {
  if (!block) {
    return [];
  }
  if (Array.isArray(block)) {
    return block;
  }
  if (Array.isArray(block.items)) {
    return block.items;
  }
  if (Array.isArray(block.Items)) {
    return block.Items;
  }
  if (Array.isArray(block.data)) {
    return block.data;
  }
  return [];
};

export const getProducts = (block: any): any[] =>
  getItems(block).filter((i: any) => i && (i.productId || i.id));

export const bannersFor = (homeData: any, placementKey: string): any[] =>
  homeData?.banners?.filter(
    (b: any) =>
      b.placementKey === placementKey || b.PlacementKey === placementKey,
  ) || [];

export const sectionTitle = (
  homeData: any,
  sectionKey: string,
  fallback: string,
): string => {
  const titles = homeData?.titles || homeData?.Titles || [];
  const found = titles.find(
    (t: any) =>
      (t.section || t.id || t.key || '').toLowerCase() ===
      sectionKey.toLowerCase(),
  );
  return found?.title || found?.Title || fallback;
};

export const resolveCatId = (cat: any) =>
  cat?.catId ??
  cat?.CatId ??
  cat?.categoryId ??
  cat?.CategoryId ??
  cat?.id ??
  cat?.Id;

export const resolveCatName = (cat: any, fallback = 'Category') =>
  cat?.catName ||
  cat?.CatName ||
  cat?.displayTitle ||
  cat?.DisplayTitle ||
  cat?.name ||
  cat?.Name ||
  fallback;

export const blockTitle = (block: any, fallback: string): string => {
  const raw =
    block?.title ||
    block?.Title ||
    block?.blockTitle ||
    block?.BlockTitle ||
    block?.displayTitle ||
    block?.DisplayTitle ||
    block?.sectionTitle ||
    block?.SectionTitle ||
    block?.catName ||
    block?.CatName ||
    block?.name ||
    block?.Name;
  const text = String(raw ?? '').trim();
  return text || fallback;
};

export const splitTitle = (title: string) => {
  const words = String(title ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 2) {
    return { text: words[0] ?? '', accent: undefined as string | undefined };
  }
  return {
    text: words.slice(0, -1).join(' '),
    accent: words[words.length - 1],
  };
};
