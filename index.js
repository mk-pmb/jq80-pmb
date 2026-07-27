/* -*- coding: UTF-8, tab-width: 2 -*- */
/* global window: true, define: true */
'use strict';
(function namespace() {
  const win = ((typeof window === 'object') && window) || false;

  function fail(e, a) { throw Object.assign(new Error(e), a); }
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
      const rootTag = EX(rootTagSpec).first();
      if (parent) { rootTag.appendTo(parent); }
      return EX.skelDive(0, rootTag, topLevelTodo);
    },


    skelDive(origCtx, topTag, todo) {
      const tr = 'jq80 skel: ';
      let ctx = origCtx;
      let tag = topTag;
      if (ctx === 0) { ctx = tag[0]; }
      if (tag.length !== 1) {
        fail(tr + 'Need a single root tag!', { ctx, tag, todo });
      }
      todo.forEach(function eachTodoItem(task) {
        if (!task) { return; }
        if (task.appendTo) {
          task.appendTo(topTag);
          tag = EX.cce(task);
          return;
        }
        if (Array.isArray(task)) { return EX.skelDive(ctx, tag, task); }
        if (!isStr(task)) { fail(tr + 'Unsupported task: ' + task); }
        const c1 = task.slice(0, 1);
        const s1 = task.slice(1);
        if (c1 === '.') { return tag.addClass(s1.split(/\s|\./)); }
        if (c1 === '#') { return tag.attr('id', s1); }
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
        if ((c1 === '<') && s1) {
          tag = EX.jq(task).appendTo(topTag);
          return;
        }
        fail(tr + 'Unsupported task: ' + task);
      });
      return topTag;
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
