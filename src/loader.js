export const calcDepth = (books) => {
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

export default ({ 'base-separation': baseSeparation, books: nested, connections }) => {
  const books = {};
  const maxDepth = calcDepth(nested);

  walk(
    nested,
    (b, acc) => {
      books[b.id] = { ...b, angle: acc };
    },
    baseSeparation,
    maxDepth,
    1,
    0,
  );

  const connectionTypes = connections.reduce((acc, c) => ({
    ...acc,
    [c.id]: { ...c, active: true },
  }), {});

  return { books, connectionTypes };
};
