const calcDepth = (books) => {
  if (books.length === 0) {
    return 0;
  }

  if (!Array.isArray(books[0])) {
    return 1;
  }

  return Math.max(...books.map(sub => calcDepth(sub))) + 1;
};

const walk = (entries, f, inc, maxDepth, depth, totalAngle) => {
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
};

export default (
  {
    'base-separation': baseSeparation,
    books: nested,
    connections,
    categories,
  },
) => {
  const books = {};
  const maxDepth = calcDepth(nested);

  const connectionTypes = connections.reduce((acc, c) => ({
    ...acc,
    [c.id]: { ...c, active: true },
  }), {});

  const groupedCategories = categories.reduce((acc, c) => ({
    ...acc,
    [c.id]: { ...c, active: true },
  }), {});

  walk(
    nested,
    (b, angle) => {
      const bookCategories = b.categories.map(c => groupedCategories[c]);
      books[b.id] = {
        ...b,
        categories: bookCategories,
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

  const flatBooks = Object.values(books);
  flatBooks.sort((a, b) => {
    if (a.publication !== undefined && b.publication !== undefined) {
      return a.publication - b.publication;
    }

    if (a.publication !== undefined) {
      return -1;
    }

    return 1;
  });

  const sortedBooks = flatBooks.reduce((acc, b, i) => ({
    ...acc,
    [b.id]: {
      ...b,
      angle: i * baseSeparation + (b.publication === undefined ? baseSeparation * 2 : 0),
    },
  }), {});

  return {
    books, sortedBooks, connectionTypes, categories: groupedCategories,
  };
};
