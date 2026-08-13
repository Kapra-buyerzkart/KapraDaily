export const groupTilesIntoRows = tiles =>
  tiles.reduce((rows, tile) => {
    const last = rows[rows.length - 1];

    if (
      tile.span === 'half' &&
      last?.span === 'half' &&
      last.items.length < 2
    ) {
      last.items.push(tile);
      return rows;
    }

    rows.push({ key: tile.id, span: tile.span, items: [tile] });
    return rows;
  }, []);
