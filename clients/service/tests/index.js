import test from 'ava';
import listen from './listen';
import { send } from 'micro';
import request from 'request-promise';

test('my endpoint', async t => {
  const fn = async function (req, res) {
    send(res, 200, { test: 'woot' });
  };
  const url = await listen(fn);
  const body = await request(url);
  t.same(body.test, 'woot');
});
