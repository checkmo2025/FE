import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function evaluate(source, imports = {}) {
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require', 'exports', output)((name) => imports[name] ?? require(name), exports);
  return exports;
}
function findExpression(path, predicate) {
  const source = ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let expression;
  const visit = (node) => { if (predicate(node, source)) expression = node.getText(source); ts.forEachChild(node, visit); };
  visit(source);
  assert.ok(expression);
  return expression;
}
test('Next image configuration accepts old and new covers but not unknown hosts', () => {
  const config = evaluate(read('next.config.ts'), { '@sentry/nextjs': { withSentryConfig: (c) => c } }).default;
  const { hasRemoteMatch } = require('next/dist/shared/lib/match-remote-pattern');
  for (const host of ['image.aladin.co.kr', 'image.yes24.com']) {
    assert.equal(hasRemoteMatch([], config.images.remotePatterns, new URL(`https://${host}/goods/123/L`)), true);
  }
  assert.equal(hasRemoteMatch([], config.images.remotePatterns, new URL('https://example.invalid/cover')), false);
});
test('empty filtered pages advance; null terminal pages stop', () => {
  const queries = evaluate(read('src/hooks/queries/useBookQueries.ts'), {
    '@tanstack/react-query': { useInfiniteQuery: (config) => config },
    '@/services/bookService': { bookService: {} },
  });
  const config = queries.useInfiniteBookSearchQuery('세트');
  assert.equal(config.getNextPageParam({ detailInfoList: [], currentPage: 1, hasNext: true }, [], 1), 2);
  assert.equal(config.getNextPageParam({ detailInfoList: [], currentPage: null, hasNext: true }, [], 2), 3);
  assert.equal(config.getNextPageParam({ detailInfoList: [], currentPage: null, hasNext: false }, [], 2), undefined);
});
test('header empty results expose the next page button', () => {
  const expr = findExpression('src/components/layout/SearchModal.tsx', (node, source) => ts.isConditionalExpression(node) && node.condition.getText(source) === 'hasNextPage' && node.getText(source).includes('다음 검색 결과 보기'));
  const { render } = evaluate(`export const render = (hasNextPage, isFetchingNextPage, fetchNextPage) => (${expr});`);
  let calls = 0;
  const button = render(true, false, () => { calls++; });
  assert.equal(button.type, 'button'); button.props.onClick(); assert.equal(calls, 1);
  assert.equal(render(true, true, () => {}).props.disabled, true);
  assert.equal(render(false, false, () => {}).type, 'div');
});
test('DB fallback detail has no product click handler; known link opens unchanged', () => {
  const expr = findExpression('src/app/(main)/books/[id]/BookDetailClient.tsx', (node, source) => ts.isConditionalExpression(node) && node.condition.getText(source) === 'bookData.link');
  const { handler } = evaluate(`export const handler = (bookData, window) => (${expr});`);
  assert.equal(handler({ link: null }, {}), undefined);
  let opened;
  handler({ link: 'https://www.yes24.com/Product/Goods/123' }, { open: (...args) => { opened = args; } })();
  assert.deepEqual(opened, ['https://www.yes24.com/Product/Goods/123', '_blank', 'noopener,noreferrer']);
});
