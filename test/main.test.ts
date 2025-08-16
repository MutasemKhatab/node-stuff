import {test,expect} from 'vitest'

test('testing if the server is running',async () =>  {
  const res = await fetch('http://localhost:3000/');
  expect(res.ok).toBe(true);
});
