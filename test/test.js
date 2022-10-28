'use strict';
var path = require('path');
var readFileSync = require('fs').readFileSync;
var normalizeNewline = require('normalize-newline');
var rework = require('@fomantic/rework');
var test = require('ava');
var reworkImport = require('../');
var fixture = path.join.bind(null, __dirname, 'fixtures');

function loadFixture(str) {
	var file = readFileSync(fixture(str), 'utf8');
	return normalizeNewline(file).trim();
}

test('import stylesheet', function (t) {
	var src = loadFixture('simple/index.css');
	var expected = loadFixture('simple/expected.css');
	var css = rework(src)
		.use(reworkImport({path: fixture('simple')}))
		.toString();

	t.assert(css === expected);
});

test('import stylesheets recursively', function (t) {
	var src = loadFixture('recursive/index.css');
	var expected = loadFixture('recursive/expected.css');
	var css = rework(src)
		.use(reworkImport({path: fixture('recursive')}))
		.toString();

	t.assert(css === expected);
});

test('import stylesheets relatively', function (t) {
	var src = loadFixture('relative/index.css');
	var expected = loadFixture('relative/expected.css');
	var css = rework(src)
		.use(reworkImport({path: fixture('relative')}))
		.toString();

	t.assert(css === expected);
});

test('import stylesheets with custom transform', function (t) {
	var src = loadFixture('transform/index.css');
	var expected = loadFixture('transform/expected.css');
	var css = rework(src)
		.use(reworkImport({
			path: fixture('transform'),
			transform: require('css-whitespace')
		}))
		.toString();

	t.assert(css === expected);
});

test('import stylesheet with long media query', function (t) {
	var src = loadFixture('media-query/index.css');
	var expected = loadFixture('media-query/expected.css');
	var css = rework(src)
		.use(reworkImport({path: fixture('media-query')}))
		.toString();

	t.assert(css === expected);
});

test('import stylesheets without `path` option', function (t) {
	var src = loadFixture('cwd/index.css');
	var expected = loadFixture('cwd/expected.css');
	var css = rework(src)
		.use(reworkImport())
		.toString();

	t.assert(css === expected);
});

test('import stylesheets with `path` passed to rework', function (t) {
	var src = loadFixture('simple/index.css');
	var expected = loadFixture('simple/expected.css');
	var css = rework(src, {source: fixture('simple/index.css')})
		.use(reworkImport())
		.toString();

	t.assert(css === expected);
});

test('show readable trace on import error', function (t) {
	var src = loadFixture('missing/index.css');
	var msg = [
		'Failed to find foo.css in [',
		'    ' + fixture('missing'),
		']'
	].join('\n');

	try {
		rework(src)
			.use(reworkImport({path: fixture('missing')}))
			.toString();
	} catch (err) {
		t.assert(err);
		t.assert(err.message === msg);
	}
});
