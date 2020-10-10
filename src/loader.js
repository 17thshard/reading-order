function calcDepth(books) {
  if (books.children === undefined) {
    return 0;
  }

  return Math.max(...books.children.map(sub => calcDepth(sub))) + 1;
}

function walk(entries, f, inc, maxDepth, depth, totalAngle, labels, lastColor) {
  let localAngle = 0;
  let terminal = false;

  entries.children.forEach((e) => {
    if (e.children === undefined) {
      f(e, totalAngle + localAngle);
      localAngle += inc;
      terminal = true;
    } else {
      localAngle += walk(
        e,
        f,
        inc,
        maxDepth,
        depth + 1,
        totalAngle + localAngle,
        labels,
        entries.color || lastColor,
      );
    }
  });

  if (entries.label) {
    labels.push({
      text: entries.label,
      color: entries.color || lastColor,
      start: totalAngle,
      end: totalAngle + localAngle - (maxDepth - depth) * inc,
      depth,
    });
  }

  return localAngle + (terminal ? maxDepth - depth : 1) * inc;
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

function getDefaultSetting(defaultSettings, category, element, fallback) {
  fallback = fallback === undefined ? true : fallback;
  const elementDefault = element.activeByDefault !== undefined
    ? element.activeByDefault
    : fallback;

  if (defaultSettings === undefined) {
    return elementDefault;
  }

  const categorySettings = defaultSettings[category];
  if (categorySettings === undefined) {
    return elementDefault;
  }

  if (!(categorySettings instanceof Object)) {
    return categorySettings === 'all';
  }

  if (categorySettings[element.id] === undefined) {
    return elementDefault;
  }

  return categorySettings[element.id] === true;
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
  defaultSettings,
) => {
  const entries = { children: nested };
  const books = {};
  const labels = [];
  const maxDepth = calcDepth(entries);

  const connectionTypes = connections.reduce((acc, c) => ({
    ...acc,
    [c.id]: {
      ...c,
      active: getDefaultSetting(defaultSettings, 'connections', c),
    },
  }), {});

  let groupedCategories = {};

  const resolvedLayers = layers.map((l, index) => {
    const layer = {
      ...l,
      order: index,
      active: defaultSettings === undefined || defaultSettings.layer === undefined
        ? l.startActive
        : l.id === defaultSettings.layer,
    };
    layer.categories = l.categories.map(c => ({
      ...c,
      layer,
      active: getDefaultSetting(defaultSettings, 'categories', c),
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
    [a.id]: {
      ...a,
      active: getDefaultSetting(defaultSettings, 'appearances', a, false),
    },
  }), {});

  walk(
    entries,
    (b, angle) => {
      const bookCategories = b.categories.map((c) => {
        const category = groupedCategories[c];
        if (category === undefined) {
          throw new Error(`Book ${b.id} references unknown category '${c}'`);
        }

        return category;
      });

      bookCategories.sort((c1, c2) => c1.layer.order - c2.layer.order);

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
    0,
    0,
    labels,
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
    labels,
  };
};
