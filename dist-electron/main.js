import { app as I, ipcMain as y, dialog as pe, BrowserWindow as le } from "electron";
import w from "path";
import { fileURLToPath as Ee } from "url";
import R from "fs";
import be from "util";
function he(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var k = { exports: {} };
function ue(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var v = {}, z;
function L() {
  return z || (z = 1, v.getBooleanOption = (r, e) => {
    let t = !1;
    if (e in r && typeof (t = r[e]) != "boolean")
      throw new TypeError(`Expected the "${e}" option to be a boolean`);
    return t;
  }, v.cppdb = Symbol(), v.inspect = Symbol.for("nodejs.util.inspect.custom")), v;
}
var x, G;
function de() {
  if (G) return x;
  G = 1;
  const r = { value: "SqliteError", writable: !0, enumerable: !1, configurable: !0 };
  function e(t, n) {
    if (new.target !== e)
      return new e(t, n);
    if (typeof n != "string")
      throw new TypeError("Expected second argument to be a string");
    Error.call(this, t), r.value = "" + t, Object.defineProperty(this, "message", r), Error.captureStackTrace(this, e), this.code = n;
  }
  return Object.setPrototypeOf(e, Error), Object.setPrototypeOf(e.prototype, Error.prototype), Object.defineProperty(e.prototype, "name", r), x = e, x;
}
var A = { exports: {} }, C, X;
function me() {
  if (X) return C;
  X = 1;
  var r = w.sep || "/";
  C = e;
  function e(t) {
    if (typeof t != "string" || t.length <= 7 || t.substring(0, 7) != "file://")
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    var n = decodeURI(t.substring(7)), a = n.indexOf("/"), o = n.substring(0, a), i = n.substring(a + 1);
    return o == "localhost" && (o = ""), o && (o = r + r + o), i = i.replace(/^(.+)\|/, "$1:"), r == "\\" && (i = i.replace(/\//g, "\\")), /^.+\:/.test(i) || (i = r + i), o + i;
  }
  return C;
}
var Y;
function ge() {
  return Y || (Y = 1, (function(r, e) {
    var t = R, n = w, a = me(), o = n.join, i = n.dirname, s = t.accessSync && function(E) {
      try {
        t.accessSync(E);
      } catch {
        return !1;
      }
      return !0;
    } || t.existsSync || n.existsSync, d = {
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
    function h(E) {
      typeof E == "string" ? E = { bindings: E } : E || (E = {}), Object.keys(d).map(function(g) {
        g in E || (E[g] = d[g]);
      }), E.module_root || (E.module_root = e.getRoot(e.getFileName())), n.extname(E.bindings) != ".node" && (E.bindings += ".node");
      for (var T = typeof __webpack_require__ == "function" ? __non_webpack_require__ : ue, l = [], u = 0, c = E.try.length, b, m, f; u < c; u++) {
        b = o.apply(
          null,
          E.try[u].map(function(g) {
            return E[g] || g;
          })
        ), l.push(b);
        try {
          return m = E.path ? T.resolve(b) : T(b), E.path || (m.path = b), m;
        } catch (g) {
          if (g.code !== "MODULE_NOT_FOUND" && g.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(g.message))
            throw g;
        }
      }
      throw f = new Error(
        `Could not locate the bindings file. Tried:
` + l.map(function(g) {
          return E.arrow + g;
        }).join(`
`)
      ), f.tries = l, f;
    }
    r.exports = e = h, e.getFileName = function(T) {
      var l = Error.prepareStackTrace, u = Error.stackTraceLimit, c = {}, b;
      Error.stackTraceLimit = 10, Error.prepareStackTrace = function(f, g) {
        for (var O = 0, H = g.length; O < H; O++)
          if (b = g[O].getFileName(), b !== __filename)
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
        if (l === "." && (l = process.cwd()), s(o(l, "package.json")) || s(o(l, "node_modules")))
          return l;
        if (u === l)
          throw new Error(
            'Could not find module root given file: "' + T + '". Do you have a `package.json` file? '
          );
        u = l, l = o(l, "..");
      }
    };
  })(A, A.exports)), A.exports;
}
var S = {}, K;
function ye() {
  if (K) return S;
  K = 1;
  const { cppdb: r } = L();
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
var U, Q;
function Te() {
  if (Q) return U;
  Q = 1;
  const { cppdb: r } = L(), e = /* @__PURE__ */ new WeakMap();
  U = function(o) {
    if (typeof o != "function") throw new TypeError("Expected first argument to be a function");
    const i = this[r], s = t(i, this), { apply: d } = Function.prototype, h = {
      default: { value: n(d, o, i, s.default) },
      deferred: { value: n(d, o, i, s.deferred) },
      immediate: { value: n(d, o, i, s.immediate) },
      exclusive: { value: n(d, o, i, s.exclusive) },
      database: { value: this, enumerable: !0 }
    };
    return Object.defineProperties(h.default.value, h), Object.defineProperties(h.deferred.value, h), Object.defineProperties(h.immediate.value, h), Object.defineProperties(h.exclusive.value, h), h.default.value;
  };
  const t = (a, o) => {
    let i = e.get(a);
    if (!i) {
      const s = {
        commit: a.prepare("COMMIT", o, !1),
        rollback: a.prepare("ROLLBACK", o, !1),
        savepoint: a.prepare("SAVEPOINT `	_bs3.	`", o, !1),
        release: a.prepare("RELEASE `	_bs3.	`", o, !1),
        rollbackTo: a.prepare("ROLLBACK TO `	_bs3.	`", o, !1)
      };
      e.set(a, i = {
        default: Object.assign({ begin: a.prepare("BEGIN", o, !1) }, s),
        deferred: Object.assign({ begin: a.prepare("BEGIN DEFERRED", o, !1) }, s),
        immediate: Object.assign({ begin: a.prepare("BEGIN IMMEDIATE", o, !1) }, s),
        exclusive: Object.assign({ begin: a.prepare("BEGIN EXCLUSIVE", o, !1) }, s)
      });
    }
    return i;
  }, n = (a, o, i, { begin: s, commit: d, rollback: h, savepoint: E, release: T, rollbackTo: l }) => function() {
    let c, b, m;
    i.inTransaction ? (c = E, b = T, m = l) : (c = s, b = d, m = h), c.run();
    try {
      const f = a.call(o, this, arguments);
      if (f && typeof f.then == "function")
        throw new TypeError("Transaction function cannot return a promise");
      return b.run(), f;
    } catch (f) {
      throw i.inTransaction && (m.run(), m !== h && b.run()), f;
    }
  };
  return U;
}
var F, J;
function we() {
  if (J) return F;
  J = 1;
  const { getBooleanOption: r, cppdb: e } = L();
  return F = function(n, a) {
    if (a == null && (a = {}), typeof n != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof a != "object") throw new TypeError("Expected second argument to be an options object");
    const o = r(a, "simple"), i = this[e].prepare(`PRAGMA ${n}`, this, !0);
    return o ? i.pluck().get() : i.all();
  }, F;
}
var B, Z;
function _e() {
  if (Z) return B;
  Z = 1;
  const r = R, e = w, { promisify: t } = be, { cppdb: n } = L(), a = t(r.access);
  B = async function(s, d) {
    if (d == null && (d = {}), typeof s != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof d != "object") throw new TypeError("Expected second argument to be an options object");
    s = s.trim();
    const h = "attached" in d ? d.attached : "main", E = "progress" in d ? d.progress : null;
    if (!s) throw new TypeError("Backup filename cannot be an empty string");
    if (s === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
    if (typeof h != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!h) throw new TypeError('The "attached" option cannot be an empty string');
    if (E != null && typeof E != "function") throw new TypeError('Expected the "progress" option to be a function');
    await a(e.dirname(s)).catch(() => {
      throw new TypeError("Cannot save backup because the directory does not exist");
    });
    const T = await a(s).then(() => !1, () => !0);
    return o(this[n].backup(this, h, s, T), E || null);
  };
  const o = (i, s) => {
    let d = 0, h = !0;
    return new Promise((E, T) => {
      setImmediate(function l() {
        try {
          const u = i.transfer(d);
          if (!u.remainingPages) {
            i.close(), E(u);
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
var M, ee;
function Re() {
  if (ee) return M;
  ee = 1;
  const { cppdb: r } = L();
  return M = function(t) {
    if (t == null && (t = {}), typeof t != "object") throw new TypeError("Expected first argument to be an options object");
    const n = "attached" in t ? t.attached : "main";
    if (typeof n != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!n) throw new TypeError('The "attached" option cannot be an empty string');
    return this[r].serialize(n);
  }, M;
}
var P, te;
function Oe() {
  if (te) return P;
  te = 1;
  const { getBooleanOption: r, cppdb: e } = L();
  return P = function(n, a, o) {
    if (a == null && (a = {}), typeof a == "function" && (o = a, a = {}), typeof n != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof o != "function") throw new TypeError("Expected last argument to be a function");
    if (typeof a != "object") throw new TypeError("Expected second argument to be an options object");
    if (!n) throw new TypeError("User-defined function name cannot be an empty string");
    const i = "safeIntegers" in a ? +r(a, "safeIntegers") : 2, s = r(a, "deterministic"), d = r(a, "directOnly"), h = r(a, "varargs");
    let E = -1;
    if (!h) {
      if (E = o.length, !Number.isInteger(E) || E < 0) throw new TypeError("Expected function.length to be a positive integer");
      if (E > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    return this[e].function(o, n, E, i, s, d), this;
  }, P;
}
var j, re;
function Se() {
  if (re) return j;
  re = 1;
  const { getBooleanOption: r, cppdb: e } = L();
  j = function(o, i) {
    if (typeof o != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof i != "object" || i === null) throw new TypeError("Expected second argument to be an options object");
    if (!o) throw new TypeError("User-defined function name cannot be an empty string");
    const s = "start" in i ? i.start : null, d = t(i, "step", !0), h = t(i, "inverse", !1), E = t(i, "result", !1), T = "safeIntegers" in i ? +r(i, "safeIntegers") : 2, l = r(i, "deterministic"), u = r(i, "directOnly"), c = r(i, "varargs");
    let b = -1;
    if (!c && (b = Math.max(n(d), h ? n(h) : 0), b > 0 && (b -= 1), b > 100))
      throw new RangeError("User-defined functions cannot have more than 100 arguments");
    return this[e].aggregate(s, d, h, E, o, b, T, l, u), this;
  };
  const t = (a, o, i) => {
    const s = o in a ? a[o] : null;
    if (typeof s == "function") return s;
    if (s != null) throw new TypeError(`Expected the "${o}" option to be a function`);
    if (i) throw new TypeError(`Missing required option "${o}"`);
    return null;
  }, n = ({ length: a }) => {
    if (Number.isInteger(a) && a >= 0) return a;
    throw new TypeError("Expected function.length to be a positive integer");
  };
  return j;
}
var $, ne;
function Le() {
  if (ne) return $;
  ne = 1;
  const { cppdb: r } = L();
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
      }, O = d.call(l, g, f);
      if (typeof O != "object" || O === null)
        throw new TypeError(`Virtual table module "${c}" did not return a table definition object`);
      return t(O, "returned", c);
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
    if (!Array.isArray(m) || !(m = [...m]).every((_) => typeof _ == "string"))
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "columns" property (should be an array of strings)`);
    if (m.length !== new Set(m).size)
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with duplicate column names`);
    if (!m.length)
      throw new RangeError(`Virtual table module "${c}" ${u} a table definition with zero columns`);
    let f;
    if (s.call(l, "parameters")) {
      if (f = l.parameters, !Array.isArray(f) || !(f = [...f]).every((_) => typeof _ == "string"))
        throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "parameters" property (should be an array of strings)`);
    } else
      f = i(b);
    if (f.length !== new Set(f).size)
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with duplicate parameter names`);
    if (f.length > 32)
      throw new RangeError(`Virtual table module "${c}" ${u} a table definition with more than the maximum number of 32 parameters`);
    for (const _ of f)
      if (m.includes(_))
        throw new TypeError(`Virtual table module "${c}" ${u} a table definition with column "${_}" which was ambiguously defined as both a column and parameter`);
    let g = 2;
    if (s.call(l, "safeIntegers")) {
      const _ = l.safeIntegers;
      if (typeof _ != "boolean")
        throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
      g = +_;
    }
    let O = !1;
    if (s.call(l, "directOnly") && (O = l.directOnly, typeof O != "boolean"))
      throw new TypeError(`Virtual table module "${c}" ${u} a table definition with an invalid "directOnly" property (should be a boolean)`);
    return [
      `CREATE TABLE x(${[
        ...f.map(E).map((_) => `${_} HIDDEN`),
        ...m.map(E)
      ].join(", ")});`,
      n(b, new Map(m.map((_, fe) => [_, f.length + fe])), c),
      f,
      g,
      O
    ];
  }
  function n(l, u, c) {
    return function* (...m) {
      const f = m.map((g) => Buffer.isBuffer(g) ? Buffer.from(g) : g);
      for (let g = 0; g < u.size; ++g)
        f.push(null);
      for (const g of l(...m))
        if (Array.isArray(g))
          a(g, f, u.size, c), yield f;
        else if (typeof g == "object" && g !== null)
          o(g, f, u, c), yield f;
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
  function o(l, u, c, b) {
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
  }), E = (l) => `"${l.replace(/"/g, '""')}"`, T = (l) => () => l;
  return $;
}
var q, oe;
function ve() {
  if (oe) return q;
  oe = 1;
  const r = function() {
  };
  return q = function(t, n) {
    return Object.assign(new r(), this);
  }, q;
}
var W, ae;
function Ne() {
  if (ae) return W;
  ae = 1;
  const r = R, e = w, t = L(), n = de();
  let a;
  function o(s, d) {
    if (new.target == null)
      return new o(s, d);
    let h;
    if (Buffer.isBuffer(s) && (h = s, s = ":memory:"), s == null && (s = ""), d == null && (d = {}), typeof s != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof d != "object") throw new TypeError("Expected second argument to be an options object");
    if ("readOnly" in d) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
    if ("memory" in d) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
    const E = s.trim(), T = E === "" || E === ":memory:", l = t.getBooleanOption(d, "readonly"), u = t.getBooleanOption(d, "fileMustExist"), c = "timeout" in d ? d.timeout : 5e3, b = "verbose" in d ? d.verbose : null, m = "nativeBinding" in d ? d.nativeBinding : null;
    if (l && T && !h) throw new TypeError("In-memory/temporary databases cannot be readonly");
    if (!Number.isInteger(c) || c < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
    if (c > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
    if (b != null && typeof b != "function") throw new TypeError('Expected the "verbose" option to be a function');
    if (m != null && typeof m != "string" && typeof m != "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
    let f;
    if (m == null ? f = a || (a = ge()("better_sqlite3.node")) : typeof m == "string" ? f = (typeof __non_webpack_require__ == "function" ? __non_webpack_require__ : ue)(e.resolve(m).replace(/(\.node)?$/, ".node")) : f = m, f.isInitialized || (f.setErrorConstructor(n), f.isInitialized = !0), !T && !E.startsWith("file:") && !r.existsSync(e.dirname(E)))
      throw new TypeError("Cannot open database because the directory does not exist");
    Object.defineProperties(this, {
      [t.cppdb]: { value: new f.Database(E, s, T, l, u, c, b || null, h || null) },
      ...i.getters
    });
  }
  const i = ye();
  return o.prototype.prepare = i.prepare, o.prototype.transaction = Te(), o.prototype.pragma = we(), o.prototype.backup = _e(), o.prototype.serialize = Re(), o.prototype.function = Oe(), o.prototype.aggregate = Se(), o.prototype.table = Le(), o.prototype.loadExtension = i.loadExtension, o.prototype.exec = i.exec, o.prototype.close = i.close, o.prototype.defaultSafeIntegers = i.defaultSafeIntegers, o.prototype.unsafeMode = i.unsafeMode, o.prototype[t.inspect] = ve(), W = o, W;
}
var ie;
function Ie() {
  return ie || (ie = 1, k.exports = Ne(), k.exports.SqliteError = de()), k.exports;
}
var ke = Ie();
const Ae = /* @__PURE__ */ he(ke), De = I.getPath("userData"), D = w.join(De, "database");
R.existsSync(D) || R.mkdirSync(D, { recursive: !0 });
const xe = w.join(D, "bibliotheca.db"), p = new Ae(xe);
p.pragma("foreign_keys = ON");
function Ce() {
  p.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      file_path TEXT NOT NULL UNIQUE,
      added_at TEXT NOT NULL,
      last_page INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0
    )
  `);
  const e = p.prepare("PRAGMA table_info(books)").all().map((t) => t.name);
  e.includes("category") || p.exec("ALTER TABLE books ADD COLUMN category TEXT DEFAULT NULL"), e.includes("author") || p.exec("ALTER TABLE books ADD COLUMN author TEXT DEFAULT NULL"), e.includes("cover_image") || p.exec("ALTER TABLE books ADD COLUMN cover_image TEXT DEFAULT NULL"), e.includes("is_indexed") || p.exec("ALTER TABLE books ADD COLUMN is_indexed INTEGER DEFAULT 0"), p.exec(`
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
const V = w.join(D, "covers");
R.existsSync(V) || R.mkdirSync(V, { recursive: !0 });
function Ue() {
  y.handle("dialog:selectFolder", async () => {
    const r = await pe.showOpenDialog({
      properties: ["openDirectory"],
      title: "PDF Klasörünü Seçin"
    });
    return r.canceled || r.filePaths.length === 0 ? null : r.filePaths[0];
  }), y.handle("db:scanFolderForPdfs", async (r, e) => {
    const t = (o, i = []) => {
      const s = R.readdirSync(o);
      for (const d of s) {
        const h = w.join(o, d);
        R.statSync(h).isDirectory() ? t(h, i) : d.toLowerCase().endsWith(".pdf") && i.push(h);
      }
      return i;
    }, n = t(e);
    p.transaction((o) => {
      const i = p.prepare(`
        INSERT OR IGNORE INTO books (title, file_path, added_at)
        VALUES (?, ?, ?)
      `);
      for (const s of o) {
        const d = w.basename(s, ".pdf"), h = (/* @__PURE__ */ new Date()).toISOString();
        i.run(d, s, h);
      }
    })(n);
  }), y.handle("db:addPdfs", async (r, e) => {
    p.transaction((n) => {
      const a = p.prepare(`
        INSERT OR IGNORE INTO books (title, file_path, added_at)
        VALUES (?, ?, ?)
      `);
      for (const o of n)
        if (o.toLowerCase().endsWith(".pdf")) {
          const i = w.basename(o, ".pdf"), s = (/* @__PURE__ */ new Date()).toISOString();
          a.run(i, o, s);
        }
    })(e);
  }), y.handle("db:getAllBooks", async () => {
    const e = p.prepare("SELECT * FROM books ORDER BY added_at DESC").all();
    for (const t of e)
      try {
        const n = R.statSync(t.file_path);
        t.file_size = n.size;
      } catch {
        t.file_size = 0;
      }
    return e;
  }), y.handle("db:getBookFile", async (r, e) => {
    const n = p.prepare("SELECT file_path FROM books WHERE id = ?").get(e);
    if (!n)
      throw new Error("Kitap bulunamadı");
    return { filePath: n.file_path };
  }), y.handle("db:updateLastPage", async (r, e, t) => {
    p.prepare("UPDATE books SET last_page = ? WHERE id = ?").run(t, e);
  }), y.handle("fs:readFile", async (r, e) => R.readFileSync(e)), y.handle("db:updateBookMetadata", async (r, e, t) => {
    const n = [], a = [];
    if (t.category !== void 0 && (n.push("category = ?"), a.push(t.category)), t.author !== void 0 && (n.push("author = ?"), a.push(t.author)), n.length > 0) {
      a.push(e);
      const o = `UPDATE books SET ${n.join(", ")} WHERE id = ?`;
      p.prepare(o).run(...a);
    }
  }), y.handle("db:toggleFavorite", async (r, e) => {
    const n = p.prepare("SELECT is_favorite FROM books WHERE id = ?").get(e);
    if (n) {
      const a = n.is_favorite === 1 ? 0 : 1;
      p.prepare("UPDATE books SET is_favorite = ? WHERE id = ?").run(a, e);
    }
  }), y.handle("db:createShelf", async (r, e) => {
    const n = p.prepare("INSERT INTO shelves (name, created_at) VALUES (?, ?)").run(e, (/* @__PURE__ */ new Date()).toISOString());
    return p.prepare("SELECT * FROM shelves WHERE id = ?").get(n.lastInsertRowid);
  }), y.handle("db:deleteShelf", async (r, e) => {
    p.prepare("DELETE FROM shelves WHERE id = ?").run(e);
  }), y.handle("db:getAllShelves", async () => p.prepare("SELECT * FROM shelves ORDER BY name ASC").all()), y.handle("db:assignBookToShelf", async (r, e, t) => {
    p.prepare("INSERT OR IGNORE INTO book_shelves (book_id, shelf_id) VALUES (?, ?)").run(e, t);
  }), y.handle("db:removeBookFromShelf", async (r, e, t) => {
    p.prepare("DELETE FROM book_shelves WHERE book_id = ? AND shelf_id = ?").run(e, t);
  }), y.handle("db:getBookShelves", async (r, e) => p.prepare(`
      SELECT s.* FROM shelves s
      JOIN book_shelves bs ON s.id = bs.shelf_id
      WHERE bs.book_id = ?
    `).all(e)), y.handle("db:getBooksByShelf", async (r, e) => p.prepare(`
      SELECT b.* FROM books b
      JOIN book_shelves bs ON b.id = bs.book_id
      WHERE bs.shelf_id = ?
      ORDER BY b.added_at DESC
    `).all(e)), y.handle("db:getBooksByCategory", async (r, e) => p.prepare("SELECT * FROM books WHERE category = ? ORDER BY added_at DESC").all(e)), y.handle("db:getFavoriteBooks", async () => p.prepare("SELECT * FROM books WHERE is_favorite = 1 ORDER BY added_at DESC").all()), y.handle("db:searchBooks", async (r, e) => {
    const t = p.prepare(`
      SELECT * FROM books 
      WHERE title LIKE ? COLLATE NOCASE OR author LIKE ? COLLATE NOCASE 
      ORDER BY added_at DESC
    `), n = `%${e}%`;
    return t.all(n, n);
  }), y.handle("db:getAllCategories", async () => p.prepare('SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != "" ORDER BY category ASC').all().map((t) => t.category)), y.handle("fs:saveCoverImage", async (r, e, t) => {
    const n = t.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!n || n.length !== 3)
      throw new Error("Geçersiz base64 verisi");
    const a = Buffer.from(n[2], "base64"), o = `cover_${e}_${Date.now()}.png`, i = w.join(V, o);
    return R.writeFileSync(i, a), p.prepare("UPDATE books SET cover_image = ? WHERE id = ?").run(i, e), i;
  }), y.handle("db:saveBookText", async (r, e, t) => {
    p.transaction((a) => {
      const o = p.prepare("INSERT INTO book_text (book_id, page_number, content) VALUES (?, ?, ?)");
      for (const s of a)
        s.content && s.content.trim().length > 0 && o.run(e, s.pageNumber, s.content);
      p.prepare("UPDATE books SET is_indexed = 1 WHERE id = ?").run(e);
    })(t);
  }), y.handle("db:fullTextSearch", async (r, e) => {
    const t = p.prepare(`
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
      const a = e.replace(/"/g, "").trim().split(/\s+/).filter(Boolean);
      if (a.length === 0) return [];
      const o = a.map((i) => `"${i}"*`).join(" ");
      return t.all(o);
    } catch (n) {
      throw console.error("FTS Arama hatası:", n), new Error("Arama işlemi sırasında bir hata oluştu. Lütfen farklı kelimeler deneyin.");
    }
  }), y.handle("db:getBookById", async (r, e) => {
    const n = p.prepare("SELECT * FROM books WHERE id = ?").get(e);
    if (n)
      try {
        const a = R.statSync(n.file_path);
        n.file_size = a.size;
      } catch {
        n.file_size = 0;
      }
    return n;
  }), y.handle("db:addBookmark", async (r, e, t, n) => ({
    id: p.prepare("INSERT INTO bookmarks (book_id, page_number, label, created_at) VALUES (?, ?, ?, ?)").run(e, t, n || null, (/* @__PURE__ */ new Date()).toISOString()).lastInsertRowid,
    book_id: e,
    page_number: t,
    label: n || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  })), y.handle("db:getBookmarks", async (r, e) => p.prepare("SELECT * FROM bookmarks WHERE book_id = ? ORDER BY page_number ASC").all(e)), y.handle("db:deleteBookmark", async (r, e) => {
    p.prepare("DELETE FROM bookmarks WHERE id = ?").run(e);
  }), y.handle("db:addNote", async (r, e, t, n) => {
    const a = (/* @__PURE__ */ new Date()).toISOString();
    return {
      id: p.prepare("INSERT INTO notes (book_id, page_number, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run(e, t, n, a, a).lastInsertRowid,
      book_id: e,
      page_number: t,
      content: n,
      created_at: a,
      updated_at: a
    };
  }), y.handle("db:getNotes", async (r, e) => p.prepare("SELECT * FROM notes WHERE book_id = ? ORDER BY page_number ASC").all(e)), y.handle("db:updateNote", async (r, e, t) => {
    p.prepare("UPDATE notes SET content = ?, updated_at = ? WHERE id = ?").run(t, (/* @__PURE__ */ new Date()).toISOString(), e);
  }), y.handle("db:deleteNote", async (r, e) => {
    p.prepare("DELETE FROM notes WHERE id = ?").run(e);
  }), y.handle("db:getLibraryStats", async () => {
    const r = p.prepare("SELECT COUNT(*) as count FROM books"), e = p.prepare("SELECT COUNT(*) as count FROM books WHERE is_favorite = 1"), t = p.prepare("SELECT SUM(last_page) as sum FROM books"), n = p.prepare("SELECT COUNT(*) as count FROM bookmarks"), a = p.prepare("SELECT COUNT(*) as count FROM notes");
    return {
      totalBooks: r.get().count || 0,
      totalFavorites: e.get().count || 0,
      totalPagesRead: t.get().sum || 0,
      totalBookmarks: n.get().count || 0,
      totalNotes: a.get().count || 0
    };
  });
}
const Fe = Ee(import.meta.url), se = w.dirname(Fe);
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
      preload: w.join(se, "preload.mjs")
    }
  }), Ue(), process.env.VITE_DEV_SERVER_URL ? N.loadURL(process.env.VITE_DEV_SERVER_URL) : N.loadFile(w.join(se, "../dist/index.html")), N.on("closed", () => {
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
