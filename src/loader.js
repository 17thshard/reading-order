function calcDepth(books) {
  if (books.length === 0) {
    return 0;
  }

  if (!Array.isArray(books[0])) {
    return 1;
  }

  return Math.max(...books.map(sub => calcDepth(sub))) + 1;
}

function walk(entries, f, inc, maxDepth, depth, totalAngle) {
  let localAngle = 0;
  let terminal = false;

  entries.forEach((e) => {
    if (!Array.isArray(e)) {
      f(e, totalAngle + localAngle);
      localAngle += inc;
      terminal = true;
    } else {
      localAngle += walk(e, f, inc, maxDepth, depth + 1, totalAngle + localAngle);
    }
  });

  return localAngle + (terminal ? maxDepth - depth + 1 : 1) * inc;
}

function sortBooks(books, field) {
  const flatBooks = books.filter(b => b.sorting !== undefined && b.sorting[field] !== undefined);
  flatBooks.sort((a, b) => a.sorting[field] - b.sorting[field]);

  return flatBooks.reduce((acc, b, i) => ({
    ...acc,
    [b.id]: {
      ...b,
      angle: i * (360 / (flatBooks.length + 1)),
      padding: 0,
      get active() {
        return b.categories.reduce((active, c) => active && c.active, true);
      },
    },
  }), {});
}

function verify(books, connections) {
  Object.values(books).forEach((b) => {
    (b.connections || []).forEach((c) => {
      if (connections[c.type] === undefined) {
        throw new Error(`Book ${b.id} has connection of unknown type '${c.type}' targeting ${c.target}`);
      }

      if (books[c.target] === undefined) {
        throw new Error(`Book ${b.id} has connection of type ${c.type} with unknown target '${c.target}'`);
      }
    });
  });
}

export default (
  {
    'base-separation': baseSeparation,
    books: nested,
    connections,
    layers,
    sorting,
    appearances,
  },
) => {
  const books = {};
  const maxDepth = calcDepth(nested);

  const connectionTypes = connections.reduce((acc, c) => ({
    ...acc,
    [c.id]: { ...c, active: c.activeByDefault !== undefined ? c.activeByDefault : true },
  }), {});

  let groupedCategories = {};

  const resolvedLayers = layers.map((l, index) => {
    const layer = {
      ...l,
      order: index,
      active: l.activeByDefault !== undefined ? l.activeByDefault : true,
    };
    layer.categories = l.categories.map(c => ({
      ...c,
      layer,
      active: c.activeByDefault !== undefined ? c.activeByDefault : true,
    }));

    groupedCategories = {
      ...groupedCategories,
      ...layer.categories.reduce((acc, c) => ({
        ...acc,
        [c.id]: c,
      }), {}),
    };

    return layer;
  });

  const groupedAppearances = appearances.reduce((acc, a) => ({
    ...acc,
    [a.id]: { ...a, active: false },
  }), {});

  walk(
    nested,
    (b, angle) => {
      const bookCategories = b.categories.map((c) => {
        const category = groupedCategories[c];
        if (category === undefined) {
          throw new Error(`Book ${b.id} references unknown category '${c}'`);
        }

        return category;
      });

      bookCategories.sort((c1, c2) => c2.layer.order - c1.layer.order);

      const bookAppearances = (b.appearances || []).map((a) => {
        const appearance = groupedAppearances[a.id];
        if (appearance === undefined) {
          throw new Error(`Book ${b.id} references unknown appearance '${a.id}'`);
        }

        return { ...a, ref: appearance };
      });
      books[b.id] = {
        ...b,
        categories: bookCategories,
        appearances: bookAppearances,
        angle,
        get active() {
          return bookCategories.reduce((active, c) => active && c.active, true);
        },
      };
    },
    baseSeparation,
    maxDepth,
    1,
    0,
  );

  verify(books, connectionTypes);

  const flatBooks = Object.values(books);
  const sorted = sorting.map(s => ({ ...s, books: sortBooks(flatBooks, s.id) }));

  return {
    books,
    sorted,
    connectionTypes,
    layers: resolvedLayers,
    appearances: Object.values(groupedAppearances),
  };
};
