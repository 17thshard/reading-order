import loader from '@/loader';

describe('Data JSON', () => {
  it('can be loaded', async () => {
    const file = await import('../../public/data.json');
    expect(file).toBeInstanceOf(Object);
    loader(file);
  });
});
