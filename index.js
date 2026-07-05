/* -*- coding: UTF-8, tab-width: 2 -*- */
/* global window: true, define: true */
'use strict';
(function namespace() {
  const win = ((typeof window === 'object') && window) || false;

  function fail(e) { throw new Error(e); }
  function isStr(x, no) { return (((typeof x) === 'string') || no); }
  function ores(x) { return x || ''; }
  function orf(x) { return x || false; }

  // eslint-disable-next-line no-param-reassign
  function setProp(d, k, v) { d[k] = v; }

  const EX = function jq80(arg) {
    if (!arg) { return fail('jq80-pmb: Argument is required'); }
    const j = (arg.jquery ? arg :  EX.jq(arg));
    Object.assign(j, EX.elemApi);
    return j;
  };
  EX.jq = ((win && win.jQuery)
    || fail.bind(null, 'Replace [jq80-pmb].jq with an actual jQuery!'));

  function mkTxt(t) { return win.document.createTextNode(ores(t)); }

  Object.assign(EX, {

    setProp,
    mkTxt,


    cce(x) {
      if (!x) { return false; }
      const k = 'contentContainerElement';
      const c = x[k] || orf(x[0])[k];
      return (c && EX.jq(c)) || x;
    },


    skel(parent, rootTagSpec, ...topLevelTodo) {
      // This is an inferior remake of dom80-pmb's mighty `skel` function.
      const rootTag = EX(rootTagSpec);
      if (parent) { rootTag.appendTo(parent); }
      const ctx = rootTag[0];
      EX.skelDive(ctx, rootTag, topLevelTodo);
      return rootTag;
    },


    skelDive(origCtx, tag, todo) {
      const tr = 'jq80 skel: ';
      let ctx = origCtx;
      if (ctx === 0) { ctx = tag[0]; }
      todo.forEach(function eachTodoItem(task) {
        if (!task) { return; }
        if (task.appendTo) { return task.appendTo(tag); }
        if (Array.isArray(task)) {
          return EX.skelDive(ctx, EX.cce(tag.children().last()), task);
        }
        if (!isStr(task)) { fail(tr + 'Unsupported task: ' + task); }
        const c1 = task.slice(0, 1);
        const s1 = task.slice(1);
        if (c1 === '.') { return tag.addClass(s1.split(/\s|\./)); }
        if (c1 === '$') {
          if (!ctx.refs) { ctx.refs = {}; }
          ctx.refs[s1] = tag;
          return;
        }
        if (c1 === '=') {
          const [, k, eq, v] = s1.split(/^([ -;@-~]*)(=|$)/);
          return tag.attr(k, eq ? v : true);
        }
        if (c1 === ':') { return s1 && tag.append(EX.mkTxt(s1)); }
        if ((c1 === '<') && s1) { return EX(task).appendTo(tag); }
        fail(tr + 'Unsupported task: ' + task);
      });
      return tag;
    },


  });



  EX.elemApi = {
    cce() { return EX.cce(this); },
    refs() { return orf(this[0].refs); },
  };













  (function unifiedExport() {
    const d = ((typeof define === 'function') && define);
    const m = ((typeof module === 'object') && module);
    if (d && d.amd) { d(function f() { return EX; }); }
    if (m && m.exports) { m.exports = EX; }
    if (d || m) { return; }
    if (win) { win.jq80 = EX; }
  }());
}());
