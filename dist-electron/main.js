import { app as I, ipcMain as y, dialog as pe, BrowserWindow as le } from "electron";
import R from "path";
import { fileURLToPath as Ee } from "url";
import O from "fs";
import be from "util";
function he(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var k = { exports: {} };
function ue(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var L = {}, H;
function v() {
  return H || (H = 1, L.getBooleanOption = (r, e) => {
    let t = !1;
    if (e in r && typeof (t = r[e]) != "boolean")
      throw new TypeError(`Expected the "${e}" option to be a boolean`);
    return t;
  }, L.cppdb = Symbol(), L.inspect = Symbol.for("nodejs.util.inspect.custom")), L;
}
var x, X;
function de() {
  if (X) return x;
  X = 1;
  const r = { value: "SqliteError", writable: !0, enumerable: !1, configurable: !0 };
  function e(t, o) {
    if (new.target !== e)
      return new e(t, o);
    if (typeof o != "string")
      throw new TypeError("Expected second argument to be a string");
    Error.call(this, t), r.value = "" + t, Object.defineProperty(this, "message", r), Error.captureStackTrace(this, e), this.code = o;
  }
  return Object.setPrototypeOf(e, Error), Object.setPrototypeOf(e.prototype, Error.prototype), Object.defineProperty(e.prototype, "name", r), x = e, x;
}
var D = { exports: {} }, C, G;
function me() {
  if (G) return C;
  G = 1;
  var r = R.sep || "/";
  C = e;
  function e(t) {
    if (typeof t != "string" || t.length <= 7 || t.substring(0, 7) != "file://")
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    var o = decodeURI(t.substring(7)), a = o.indexOf("/"), n = o.substring(0, a), i = o.substring(a + 1);
    return n == "localhost" && (n = ""), n && (n = r + r + n), i = i.replace(/^(.+)\|/, "$1:"), r == "\\" && (i = i.replace(/\//g, "\\")), /^.+\:/.test(i) || (i = r + i), n + i;
  }
  return C;
}
var Y;
function ge() {
  return Y || (Y = 1, (function(r, e) {
    var t = O, o = R, a = me(), n = o.join, i = o.dirname, s = t.accessSync && function(p) {
      try {
        t.accessSync(p);
      } catch {
        return !1;
      }
      return !0;
    } || t.existsSync || o.existsSync, d = {
      arrow: process.env.NODE_BINDINGS_ARROW || " → ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function h(p) {
      typeof p == "string" ? p = { bindings: p } : p || (p = {}), Object.keys(d).map(function(g) {
        g in p || (p[g] = d[g]);
      }), p.module_root || (p.module_root = e.getRoot(e.getFileName())), o.extname(p.bindings) != ".node" && (p.bindings += ".node");
      for (var T = typeof __webpack_require__ == "function" ? __non_webpack_require__ : ue, l = [], u = 0, c = p.try.length, b, m, f; u < c; u++) {
        b = n.apply(
          null,
          p.try[u].map(function(g) {
            return p[g] || g;
          })
        ), l.push(b);
        try {
          return m = p.path ? T.resolve(b) : T(b), p.path || (m.path = b), m;
        } catch (g) {
          if (g.code !== "MODULE_NOT_FOUND" && g.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(g.message))
            throw g;
        }
      }
      throw f = new Error(
        `Could not locate the bindings file. Tried:
` + l.map(function(g) {
          return p.arrow + g;
        }).join(`
`)
      ), f.tries = l, f;
    }
    r.exports = e = h, e.getFileName = function(T) {
      var l = Error.prepareStackTrace, u = Error.stackTraceLimit, c = {}, b;
      Error.stackTraceLimit = 10, Error.prepareStackTrace = function(f, g) {
        for (var _ = 0, V = g.length; _ < V; _++)
          if (b = g[_].getFileName(), b !== __filename)
            if (T) {
              if (b !== T)
                return;
            } else
              return;
      }, Error.captureStackTrace(c), c.stack, Error.prepareStackTrace = l, Error.stackTraceLimit = u;
      var m = "file://";
      return b.indexOf(m) === 0 && (b = a(b)), b;
    }, e.getRoot = function(T) {
      for (var l = i(T), u; ; ) {
        if (l === "." && (l = process.cwd()), s(n(l, "package.json")) || s(n(l, "node_modules")))
          return l;
        if (u === l)
          throw new Error(
            'Could not find module root given file: "' + T + '". Do you have a `package.json` file? '
          );
        u = l, l = n(l, "..");
      }
    };
  })(D, D.exports)), D.exports;
}
var S = {}, z;
function ye() {
  if (z) return S;
  z = 1;
  const { cppdb: r } = v();
  return S.prepare = function(t) {
    return this[r].prepare(t, this, !1);
  }, S.exec = function(t) {
    return this[r].exec(t), this;
  }, S.close = function() {
    return this[r].close(), this;
  }, S.loadExtension = function(...t) {
    return this[r].loadExtension(...t), this;
  }, S.defaultSafeIntegers = function(...t) {
    return this[r].defaultSafeIntegers(...t), this;
  }, S.unsafeMode = function(...t) {
    return this[r].unsafeMode(...t), this;
  }, S.getters = {
    name: {
      get: function() {
        return this[r].name;
      },
      enumerable: !0
    },
    open: {
      get: function() {
        return this[r].open;
      },
      enumerable: !0
    },
    inTransaction: {
      get: function() {
        return this[r].inTransaction;
      },
      enumerable: !0
    },
    readonly: {
      get: function() {
        return this[r].readonly;
      },
      enumerable: !0
    },
    memory: {
      get: function() {
        return this[r].memory;
      },
      enumerable: !0
    }
  }, S;
}
var U, K;
function Te() {
  if (K) return U;
  K = 1;
  const { cppdb: r } = v(), e = /* @__PURE__ */ new WeakMap();
  U = function(n) {
    if (typeof n != "function") throw new TypeError("Expected first argument to be a function");
    const i = this[r], s = t(i, this), { apply: d } = Function.prototype, h = {
      default: { value: o(d, n, i, s.default) },
      deferred: { value: o(d, n, i, s.deferred) },
      immediate: { value: o(d, n, i, s.immediate) },
      exclusive: { value: o(d, n, i, s.exclusive) },
      database: { value: this, enumerable: !0 }
    };
    return Object.defineProperties(h.default.value, h), Object.defineProperties(h.deferred.value, h), Object.defineProperties(h.immediate.value, h), Object.defineProperties(h.exclusive.value, h), h.default.value;
  };
  const t = (a, n) => {
    let i = e.get(a);
    if (!i) {
      const s = {
        commit: a.prepare("COMMIT", n, !1),
        rollback: a.prepare("ROLLBACK", n, !1),
        savepoint: a.prepare("SAVEPOINT `	_bs3.	`", n, !1),
        release: a.prepare("RELEASE `	_bs3.	`", n, !1),
        rollbackTo: a.prepare("ROLLBACK TO `	_bs3.	`", n, !1)
      };
      e.set(a, i = {
        default: Object.assign({ begin: a.prepare("BEGIN", n, !1) }, s),
        deferred: Object.assign({ begin: a.prepare("BEGIN DEFERRED", n, !1) }, s),
        immediate: Object.assign({ begin: a.prepare("BEGIN IMMEDIATE", n, !1) }, s),
        exclusive: Object.assign({ begin: a.prepare("BEGIN EXCLUSIVE", n, !1) }, s)
      });
    }
    return i;
  }, o = (a, n, i, { begin: s, commit: d, rollback: h, savepoint: p, release: T, rollbackTo: l }) => function() {
    let c, b, m;
    i.inTransaction ? (c = p, b = T, m = l) : (c = s, b = d, m = h), c.run();
    try {
      const f = a.call(n, this, arguments);
      if (f && typeof f.then == "function")
        throw new TypeError("Transaction function cannot return a promise");
      return b.run(), f;
    } catch (f) {
      throw i.inTransaction && (m.run(), m !== h && b.run()), f;
    }
  };
  return U;
}
var F, Q;
function we() {
  if (Q) return F;
  Q = 1;
  const { getBooleanOption: r, cppdb: e } = v();
  return F = function(o, a) {
    if (a == null && (a = {}), typeof o != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof a != "object") throw new TypeError("Expected second argument to be an options object");
    const n = r(a, "simple"), i = this[e].prepare(`PRAGMA ${o}`, this, !0);
    return n ? i.pluck().get() : i.all();
  }, F;
}
var B, J;
function Re() {
  if (J) return B;
  J = 1;
  const r = O, e = R, { promisify: t } = be, { cppdb: o } = v(), a = t(r.access);
  B = async function(s, d) {
    if (d == null && (d = {}), typeof s != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof d != "object") throw new TypeError("Expected second argument to be an options object");
    s = s.trim();
    const h = "attached" in d ? d.attached : "main", p = "progress" in d ? d.progress : null;
    if (!s) throw new TypeError("Backup filename cannot be an empty string");
    if (s === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
    if (typeof h != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!h) throw new TypeError('The "attached" option cannot be an empty string');
    if (p != null && typeof p != "function") throw new TypeError('Expected the "progress" option to be a function');
    await a(e.dirname(s)).catch(() => {
      throw new TypeError("Cannot save backup because the directory does not exist");
    });
    const T = await a(s).then(() => !1, () => !0);
    return n(this[o].backup(this, h, s, T), p || null);
  };
  const n = (i, s) => {
    let d = 0, h = !0;
    return new Promise((p, T) => {
      setImmediate(function l() {
        try {
          const u = i.transfer(d);
          if (!u.remainingPages) {
            i.close(), p(u);
            return;
          }
          if (h && (h = !1, d = 100), s) {
            const c = s(u);
            if (c !== void 0)
              if (typeof c == "number" && c === c) d = Math.max(0, Math.min(2147483647, Math.round(c)));
              else throw new TypeError("Expected progress callback to return a number or undefined");
          }
          setImmediate(l);
        } catch (u) {
          i.close(), T(u);
        }
      });
    });
  };
  return B;
}
var M, Z;
function _e() {
  if (Z) return M;
  Z = 1;
  const { cppdb: r } = v();
  return M = function(t) {
    if (t == null && (t = {}), typeof t != "object") throw new TypeError("Expected first argument to be an options object");
    const o = "attached" in t ? t.attached : "main";
    if (typeof o != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!o) throw new TypeError('The "attached" option cannot be an empty string');
    return this[r].serialize(o);
  }, M;
}
var P, ee;
function Oe() {
  if (ee) return P;
  ee = 1;
  const { getBooleanOption: r, cppdb: e } = v();
  return P = function(o, a, n) {
    if (a == null && (a = {}), typeof a == "function" && (n = a, a = {}), typeof o != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof n != "function") throw new TypeError("Expected last argument to be a function");
    if (typeof a != "object") throw new TypeError("Expected second argument to be an options object");
    if (!o) throw new TypeError("User-defined function name cannot be an empty string");
    const i = "safeIntegers" in a ? +r(a, "safeIntegers") : 2, s = r(a, "deterministic"), d = r(a, "directOnly"), h = r(a, "varargs");
    let p = -1;
    if (!h) {
      if (p = n.length, !Number.isInteger(p) || p < 0) throw new TypeError("Expected function.length to be a positive integer");
      if (p > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    return this[e].function(n, o, p, i, s, d), this;
  }, P;
}
var j, te;
function Se() {
  if (te) return j;
  te = 1;
  const { getBooleanOption: r, cppdb: e } = v();
  j = function(n, i) {
    if (typeof n != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof i != "object" || i === null) throw new TypeError("Expected second argument to be an options object");
    if (!n) throw new TypeError("User-defined function name cannot be an empty string");
    const s = "start" in i ? i.start : null, d = t(i, "step", !0), h = t(i, "inverse", !1), p = t(i, "result", !1), T = "safeIntegers" in i ? +r(i, "safeIntegers") : 2, l = r(i, "deterministic"), u = r(i, "directOnly"), c = r(i, "varargs");
    let b = -1;
    if (!c && (b = Math.max(o(d), h ? o(h) : 0), b > 0 && (b -= 1), b > 100))
      throw new RangeError("User-defined functions cannot have more than 100 arguments");
    return this[e].aggregate(s, d, h, p, n, b, T, l, u), this;
  };
  const t = (a, n, i) => {
    const s = n in a ? a[n] : null;
    if (typeof s == "function") return s;
    if (s != null) throw new TypeError(`Expected the "${n}" option to be a function`);
    if (i) throw new TypeError(`Missing required option "${n}"`);
    return null;
  }, o = ({ length: a }) => {
    if (Number.isInteger(a) && a >= 0) return a;
    throw new TypeError("Expected function.length to be a positive integer");
  };
  return j;
}
var $, re;
function ve() {
  if (re) return $;
  re = 1;
  const { cppdb: r } = v();
  $ = function(u, c) {
    if (typeof u != "string") throw new TypeError("Expected first argument to be a string");
    if (!u) throw new TypeError("Virtual table module name cannot be an empty string");
    let b = !1;
    if (typeof c == "object" && c !== null)
      b = !0, c = T(t(c, "used", u));
    else {
      if (typeof c != "function") throw new TypeError("Expected second argument to be a function or a table definition object");
      c = e(c);
    }
    return this[r].table(c, u, b), this;
  };
  function e(l) {
    return function(c, b, m, ...f) {
      const g = {
        module: c,
        database: b,
        table: m
      }, _ = d.call(l, g, f);
      if (typeof _ != "object" || _ === null)
        throw new TypeError(`Virtual table module "${c}" did not return a table definition object`);
      return t(_, "returned", c);
    };
  }
  function t(l, u, c) {
    if (!s.call(l, "rows"))
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition without a "rows" property`);
    if (!s.call(l, "columns"))
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition without a "columns" property`);
    const b = l.rows;
    if (typeof b != "function" || Object.getPrototypeOf(b) !== h)
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "rows" property (should be a generator function)`);
    let m = l.columns;
    if (!Array.isArray(m) || !(m = [...m]).every((w) => typeof w == "string"))
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "columns" property (should be an array of strings)`);
    if (m.length !== new Set(m).size)
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with duplicate column names`);
    if (!m.length)
      throw new RangeError(`Virtual table module "${c}" ${u} a table definition with zero columns`);
    let f;
    if (s.call(l, "parameters")) {
      if (f = l.parameters, !Array.isArray(f) || !(f = [...f]).every((w) => typeof w == "string"))
        throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "parameters" property (should be an array of strings)`);
    } else
      f = i(b);
    if (f.length !== new Set(f).size)
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with duplicate parameter names`);
    if (f.length > 32)
      throw new RangeError(`Virtual table module "${c}" ${u} a table definition with more than the maximum number of 32 parameters`);
    for (const w of f)
      if (m.includes(w))
        throw new TypeError(`Virtual table module "${c}" ${u} a table definition with column "${w}" which was ambiguously defined as both a column and parameter`);
    let g = 2;
    if (s.call(l, "safeIntegers")) {
      const w = l.safeIntegers;
      if (typeof w != "boolean")
        throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
      g = +w;
    }
    let _ = !1;
    if (s.call(l, "directOnly") && (_ = l.directOnly, typeof _ != "boolean"))
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "directOnly" property (should be a boolean)`);
    return [
      `CREATE TABLE x(${[
        ...f.map(p).map((w) => `${w} HIDDEN`),
        ...m.map(p)
      ].join(", ")});`,
      o(b, new Map(m.map((w, fe) => [w, f.length + fe])), c),
      f,
      g,
      _
    ];
  }
  function o(l, u, c) {
    return function* (...m) {
      const f = m.map((g) => Buffer.isBuffer(g) ? Buffer.from(g) : g);
      for (let g = 0; g < u.size; ++g)
        f.push(null);
      for (const g of l(...m))
        if (Array.isArray(g))
          a(g, f, u.size, c), yield f;
        else if (typeof g == "object" && g !== null)
          n(g, f, u, c), yield f;
        else
          throw new TypeError(`Virtual table module "${c}" yielded something that isn't a valid row object`);
    };
  }
  function a(l, u, c, b) {
    if (l.length !== c)
      throw new TypeError(`Virtual table module "${b}" yielded a row with an incorrect number of columns`);
    const m = u.length - c;
    for (let f = 0; f < c; ++f)
      u[f + m] = l[f];
  }
  function n(l, u, c, b) {
    let m = 0;
    for (const f of Object.keys(l)) {
      const g = c.get(f);
      if (g === void 0)
        throw new TypeError(`Virtual table module "${b}" yielded a row with an undeclared column "${f}"`);
      u[g] = l[f], m += 1;
    }
    if (m !== c.size)
      throw new TypeError(`Virtual table module "${b}" yielded a row with missing columns`);
  }
  function i({ length: l }) {
    if (!Number.isInteger(l) || l < 0)
      throw new TypeError("Expected function.length to be a positive integer");
    const u = [];
    for (let c = 0; c < l; ++c)
      u.push(`$${c + 1}`);
    return u;
  }
  const { hasOwnProperty: s } = Object.prototype, { apply: d } = Function.prototype, h = Object.getPrototypeOf(function* () {
  }), p = (l) => `"${l.replace(/"/g, '""')}"`, T = (l) => () => l;
  return $;
}
var q, ne;
function Le() {
  if (ne) return q;
  ne = 1;
  const r = function() {
  };
  return q = function(t, o) {
    return Object.assign(new r(), this);
  }, q;
}
var W, oe;
function Ne() {
  if (oe) return W;
  oe = 1;
  const r = O, e = R, t = v(), o = de();
  let a;
  function n(s, d) {
    if (new.target == null)
      return new n(s, d);
    let h;
    if (Buffer.isBuffer(s) && (h = s, s = ":memory:"), s == null && (s = ""), d == null && (d = {}), typeof s != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof d != "object") throw new TypeError("Expected second argument to be an options object");
    if ("readOnly" in d) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
    if ("memory" in d) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
    const p = s.trim(), T = p === "" || p === ":memory:", l = t.getBooleanOption(d, "readonly"), u = t.getBooleanOption(d, "fileMustExist"), c = "timeout" in d ? d.timeout : 5e3, b = "verbose" in d ? d.verbose : null, m = "nativeBinding" in d ? d.nativeBinding : null;
    if (l && T && !h) throw new TypeError("In-memory/temporary databases cannot be readonly");
    if (!Number.isInteger(c) || c < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
    if (c > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
    if (b != null && typeof b != "function") throw new TypeError('Expected the "verbose" option to be a function');
    if (m != null && typeof m != "string" && typeof m != "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
    let f;
    if (m == null ? f = a || (a = ge()("better_sqlite3.node")) : typeof m == "string" ? f = (typeof __non_webpack_require__ == "function" ? __non_webpack_require__ : ue)(e.resolve(m).replace(/(\.node)?$/, ".node")) : f = m, f.isInitialized || (f.setErrorConstructor(o), f.isInitialized = !0), !T && !p.startsWith("file:") && !r.existsSync(e.dirname(p)))
      throw new TypeError("Cannot open database because the directory does not exist");
    Object.defineProperties(this, {
      [t.cppdb]: { value: new f.Database(p, s, T, l, u, c, b || null, h || null) },
      ...i.getters
    });
  }
  const i = ye();
  return n.prototype.prepare = i.prepare, n.prototype.transaction = Te(), n.prototype.pragma = we(), n.prototype.backup = Re(), n.prototype.serialize = _e(), n.prototype.function = Oe(), n.prototype.aggregate = Se(), n.prototype.table = ve(), n.prototype.loadExtension = i.loadExtension, n.prototype.exec = i.exec, n.prototype.close = i.close, n.prototype.defaultSafeIntegers = i.defaultSafeIntegers, n.prototype.unsafeMode = i.unsafeMode, n.prototype[t.inspect] = Le(), W = n, W;
}
var ae;
function Ie() {
  return ae || (ae = 1, k.exports = Ne(), k.exports.SqliteError = de()), k.exports;
}
var ke = Ie();
const De = /* @__PURE__ */ he(ke), Ae = I.getPath("userData"), A = R.join(Ae, "database");
O.existsSync(A) || O.mkdirSync(A, { recursive: !0 });
const xe = R.join(A, "bibliotheca.db"), E = new De(xe);
E.pragma("foreign_keys = ON");
function Ce() {
  E.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      file_path TEXT NOT NULL UNIQUE,
      added_at TEXT NOT NULL,
      last_page INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0
    )
  `);
  const e = E.prepare("PRAGMA table_info(books)").all().map((t) => t.name);
  e.includes("category") || E.exec("ALTER TABLE books ADD COLUMN category TEXT DEFAULT NULL"), e.includes("author") || E.exec("ALTER TABLE books ADD COLUMN author TEXT DEFAULT NULL"), e.includes("cover_image") || E.exec("ALTER TABLE books ADD COLUMN cover_image TEXT DEFAULT NULL"), e.includes("is_indexed") || E.exec("ALTER TABLE books ADD COLUMN is_indexed INTEGER DEFAULT 0"), E.exec(`
    CREATE TABLE IF NOT EXISTS shelves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS book_shelves (
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      shelf_id INTEGER NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
      PRIMARY KEY (book_id, shelf_id)
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      page_number INTEGER NOT NULL,
      label TEXT DEFAULT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      page_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS book_text USING fts5(
      book_id UNINDEXED,
      page_number UNINDEXED,
      content
    );
  `);
}
const ie = R.join(A, "covers");
O.existsSync(ie) || O.mkdirSync(ie, { recursive: !0 });
function Ue() {
  y.handle("dialog:selectFolder", async () => {
    const r = await pe.showOpenDialog({
      properties: ["openDirectory"],
      title: "PDF Klasörünü Seçin"
    });
    return r.canceled || r.filePaths.length === 0 ? null : r.filePaths[0];
  }), y.handle("db:scanFolderForPdfs", async (r, e) => {
    const t = (n, i = []) => {
      const s = O.readdirSync(n);
      for (const d of s) {
        const h = R.join(n, d);
        O.statSync(h).isDirectory() ? t(h, i) : d.toLowerCase().endsWith(".pdf") && i.push(h);
      }
      return i;
    }, o = t(e);
    E.transaction((n) => {
      const i = E.prepare(`
        INSERT OR IGNORE INTO books (title, file_path, added_at)
        VALUES (?, ?, ?)
      `);
      for (const s of n) {
        const d = R.basename(s, ".pdf"), h = (/* @__PURE__ */ new Date()).toISOString();
        i.run(d, s, h);
      }
    })(o);
  }), y.handle("db:getAllBooks", async () => E.prepare("SELECT * FROM books ORDER BY added_at DESC").all()), y.handle("db:getBookFile", async (r, e) => {
    const o = E.prepare("SELECT file_path FROM books WHERE id = ?").get(e);
    if (!o)
      throw new Error("Kitap bulunamadı");
    return { filePath: o.file_path };
  }), y.handle("db:updateLastPage", async (r, e, t) => {
    E.prepare("UPDATE books SET last_page = ? WHERE id = ?").run(t, e);
  }), y.handle("fs:readFile", async (r, e) => O.readFileSync(e)), y.handle("db:updateBookMetadata", async (r, e, t) => {
    const o = [], a = [];
    if (t.category !== void 0 && (o.push("category = ?"), a.push(t.category)), t.author !== void 0 && (o.push("author = ?"), a.push(t.author)), o.length > 0) {
      a.push(e);
      const n = `UPDATE books SET ${o.join(", ")} WHERE id = ?`;
      E.prepare(n).run(...a);
    }
  }), y.handle("db:toggleFavorite", async (r, e) => {
    const o = E.prepare("SELECT is_favorite FROM books WHERE id = ?").get(e);
    if (o) {
      const a = o.is_favorite === 1 ? 0 : 1;
      E.prepare("UPDATE books SET is_favorite = ? WHERE id = ?").run(a, e);
    }
  }), y.handle("db:createShelf", async (r, e) => {
    const o = E.prepare("INSERT INTO shelves (name, created_at) VALUES (?, ?)").run(e, (/* @__PURE__ */ new Date()).toISOString());
    return E.prepare("SELECT * FROM shelves WHERE id = ?").get(o.lastInsertRowid);
  }), y.handle("db:deleteShelf", async (r, e) => {
    E.prepare("DELETE FROM shelves WHERE id = ?").run(e);
  }), y.handle("db:getAllShelves", async () => E.prepare("SELECT * FROM shelves ORDER BY name ASC").all()), y.handle("db:assignBookToShelf", async (r, e, t) => {
    E.prepare("INSERT OR IGNORE INTO book_shelves (book_id, shelf_id) VALUES (?, ?)").run(e, t);
  }), y.handle("db:removeBookFromShelf", async (r, e, t) => {
    E.prepare("DELETE FROM book_shelves WHERE book_id = ? AND shelf_id = ?").run(e, t);
  }), y.handle("db:getBookShelves", async (r, e) => E.prepare(`
      SELECT s.* FROM shelves s
      JOIN book_shelves bs ON s.id = bs.shelf_id
      WHERE bs.book_id = ?
    `).all(e)), y.handle("db:getBooksByShelf", async (r, e) => E.prepare(`
      SELECT b.* FROM books b
      JOIN book_shelves bs ON b.id = bs.book_id
      WHERE bs.shelf_id = ?
      ORDER BY b.added_at DESC
    `).all(e)), y.handle("db:getBooksByCategory", async (r, e) => E.prepare("SELECT * FROM books WHERE category = ? ORDER BY added_at DESC").all(e)), y.handle("db:getFavoriteBooks", async () => E.prepare("SELECT * FROM books WHERE is_favorite = 1 ORDER BY added_at DESC").all()), y.handle("db:searchBooks", async (r, e) => {
    const t = E.prepare(`
      SELECT * FROM books 
      WHERE title LIKE ? COLLATE NOCASE OR author LIKE ? COLLATE NOCASE 
      ORDER BY added_at DESC
    `), o = `%${e}%`;
    return t.all(o, o);
  }), y.handle("db:getAllCategories", async () => E.prepare('SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != "" ORDER BY category ASC').all().map((t) => t.category)), y.handle("fs:saveCoverImage", async (r, e, t) => {
    const o = t.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!o || o.length !== 3)
      throw new Error("Geçersiz base64 verisi");
    const a = Buffer.from(o[2], "base64"), { coversDir: n } = require("./db"), i = `cover_${e}_${Date.now()}.png`, s = R.join(n, i);
    return O.writeFileSync(s, a), E.prepare("UPDATE books SET cover_image = ? WHERE id = ?").run(s, e), s;
  }), y.handle("db:saveBookText", async (r, e, t) => {
    E.transaction((a) => {
      const n = E.prepare("INSERT INTO book_text (book_id, page_number, content) VALUES (?, ?, ?)");
      for (const s of a)
        s.content && s.content.trim().length > 0 && n.run(e, s.pageNumber, s.content);
      E.prepare("UPDATE books SET is_indexed = 1 WHERE id = ?").run(e);
    })(t);
  }), y.handle("db:fullTextSearch", async (r, e) => {
    const t = E.prepare(`
      SELECT 
        bt.book_id, 
        bt.page_number, 
        b.title, 
        SNIPPET(book_text, 2, '<b>', '</b>', '...', 15) as snippet
      FROM book_text bt
      JOIN books b ON b.id = bt.book_id
      WHERE book_text MATCH ?
      ORDER BY rank
      LIMIT 100
    `);
    try {
      const o = `"${e}"*`;
      return t.all(o);
    } catch (o) {
      return console.error("FTS Arama hatası:", o), [];
    }
  }), y.handle("db:addBookmark", async (r, e, t, o) => ({
    id: E.prepare("INSERT INTO bookmarks (book_id, page_number, label, created_at) VALUES (?, ?, ?, ?)").run(e, t, o || null, (/* @__PURE__ */ new Date()).toISOString()).lastInsertRowid,
    book_id: e,
    page_number: t,
    label: o || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  })), y.handle("db:getBookmarks", async (r, e) => E.prepare("SELECT * FROM bookmarks WHERE book_id = ? ORDER BY page_number ASC").all(e)), y.handle("db:deleteBookmark", async (r, e) => {
    E.prepare("DELETE FROM bookmarks WHERE id = ?").run(e);
  }), y.handle("db:addNote", async (r, e, t, o) => {
    const a = (/* @__PURE__ */ new Date()).toISOString();
    return {
      id: E.prepare("INSERT INTO notes (book_id, page_number, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run(e, t, o, a, a).lastInsertRowid,
      book_id: e,
      page_number: t,
      content: o,
      created_at: a,
      updated_at: a
    };
  }), y.handle("db:getNotes", async (r, e) => E.prepare("SELECT * FROM notes WHERE book_id = ? ORDER BY page_number ASC").all(e)), y.handle("db:updateNote", async (r, e, t) => {
    E.prepare("UPDATE notes SET content = ?, updated_at = ? WHERE id = ?").run(t, (/* @__PURE__ */ new Date()).toISOString(), e);
  }), y.handle("db:deleteNote", async (r, e) => {
    E.prepare("DELETE FROM notes WHERE id = ?").run(e);
  }), y.handle("db:getLibraryStats", async () => {
    const r = E.prepare("SELECT COUNT(*) as count FROM books"), e = E.prepare("SELECT COUNT(*) as count FROM books WHERE is_favorite = 1"), t = E.prepare("SELECT SUM(last_page) as sum FROM books"), o = E.prepare("SELECT COUNT(*) as count FROM bookmarks"), a = E.prepare("SELECT COUNT(*) as count FROM notes");
    return {
      totalBooks: r.get().count || 0,
      totalFavorites: e.get().count || 0,
      totalPagesRead: t.get().sum || 0,
      totalBookmarks: o.get().count || 0,
      totalNotes: a.get().count || 0
    };
  });
}
const Fe = Ee(import.meta.url), se = R.dirname(Fe);
Ce();
let N = null;
function ce() {
  const r = process.platform === "darwin";
  N = new le({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hidden",
    ...r ? { trafficLightPosition: { x: 16, y: 16 } } : { titleBarOverlay: { color: "#ffffff", symbolColor: "#0f172a", height: 40 } },
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: R.join(se, "preload.mjs")
    }
  }), Ue(), process.env.VITE_DEV_SERVER_URL ? N.loadURL(process.env.VITE_DEV_SERVER_URL) : N.loadFile(R.join(se, "../dist/index.html")), N.on("closed", () => {
    N = null;
  });
}
I.whenReady().then(() => {
  ce(), I.on("activate", () => {
    le.getAllWindows().length === 0 && ce();
  });
});
I.on("window-all-closed", () => {
  process.platform !== "darwin" && I.quit();
});
