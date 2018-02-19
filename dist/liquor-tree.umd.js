(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LiquorTree = factory());
}(this, (function () { 'use strict';

(function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=" .tree-node { white-space: nowrap; } .tree-arrow { display: inline-block; height: 30px; cursor: pointer; margin-left: 30px; width: 0; } .tree-checkbox { display: inline-block; position: relative; width: 30px; height: 30px; box-sizing: border-box; border: 1px solid #dadada; border-radius: 2px; background: #fff; transition: border-color .25s, background-color .25s; } .tree-checkbox:after, .tree-arrow:after { position: absolute; display: block; content: \"\"; } .tree--checked > .tree-checkbox, .tree--indeterminate > .tree-checkbox { background-color: #3a99fc; border-color: #218eff; } .tree--checked > .tree-checkbox:after { box-sizing: content-box; border: 1.5px solid #fff; /* probably width would be rounded in most cases */ border-left: 0; border-top: 0; left: 9px; top: 3px; height: 15px; width: 8px; transform: rotate(45deg) scaleY(0); transition: transform .25s; transform-origin: center; } .tree--checked > .tree-checkbox:after { transform: rotate(45deg) scaleY(1); } .tree--indeterminate > .tree-checkbox:after { background-color: #fff; top: 50%; left: 20%; right: 20%; height: 2px; } .tree-anchor { outline-color: #eee; outline-width: 1px; display: inline-block; text-decoration: none; color: #343434; vertical-align: top; height: 24px; line-height: 24px; padding: 3px 6px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } .tree-anchor:hover { background-color: #fafafa; } .tree--selected > .tree-anchor { background: #f0f0f0; } .tree--has-child > .tree-arrow { margin-left: 0; width: 30px; position: relative; } .tree--has-child > .tree-arrow:after { border: 1.5px solid #494646; position: absolute; border-left: 0; border-top: 0; left: 9px; top: 50%; height: 9px; width: 9px; transform: rotate(-45deg) translateY(-50%) translateX(0); transition: transform .25s; transform-origin: center; } .tree--expanded > .tree-arrow:after { transform: rotate(45deg) translateY(-50%) translateX(-5px); } .tree--disabled { color: #fff; background: #fff; opacity: .6; cursor: default; } .tree--disabled > .tree-anchor, .tree--disabled > .tree-anchor span { background: #fff; cursor: default; } .tree--disabled > .tree-anchor:focus { outline: none; } .l-fade-enter-active, .l-fade-leave-active { transition: opacity .3s, transform .3s; transform: translateX(0); } .l-fade-enter, .l-fade-leave-to { opacity: 0; transform: translateX(-2em); } "; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();

































var TreeNode = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticClass:"tree-node",class:_vm.nodeClass},[_c('i',{staticClass:"tree-arrow",on:{"click":_vm.toggleExpand}}),_vm._v(" "),(_vm.options.checkbox)?_c('i',{staticClass:"tree-checkbox",on:{"click":_vm.check}}):_vm._e(),_vm._v(" "),_c('a',{ref:"anchor",staticClass:"tree-anchor",attrs:{"href":"javascript:void(0)","tabindex":"1"},on:{"focus":_vm.onNodeFocus,"click":_vm.select}},[_c('node-content',{attrs:{"node":_vm.node}})],1),_vm._v(" "),_c('transition',{attrs:{"name":"l-fade"}},[(_vm.hasChildren() && _vm.state.expanded)?_c('ul',{staticClass:"tree-children"},_vm._l((_vm.node.children),function(child,i){return (child.visible())?_c('node',{key:child.id,attrs:{"node":child,"options":_vm.options}}):_vm._e()})):_vm._e()])],1)},staticRenderFns: [],
  name: 'Node',
  inject: ['tree'],
  props: ['node', 'options'],

  components: {
    NodeContent: {
      props: ['node'],
      render: function render(h) {
        var node = this.node;
        var vm = this.node.tree.vm;

        return vm.$scopedSlots.default
          ? vm.$scopedSlots.default({ node: this.node })
          : h('span', {
            domProps: {
              innerHTML: node.text
            }
          })
      }
    }
  },

  data: function data() {
    this.node.vm = this;

    return {
      state: this.node.states
    }
  },

  computed: {
    nodeClass: function nodeClass() {
      var state = this.state;
      var hasChildren = this.hasChildren();
      var classes = {
        'tree--has-child': hasChildren,
        'tree--expanded': hasChildren && state.expanded,
        'tree--selected': state.selected,
        'tree--disabled': state.disabled
      };

      if (this.options.checkbox) {
        classes['tree--checked'] = state.checked;
        classes['tree--indeterminate'] = state.indeterminate;
      }

      return classes
    }
  },


  methods: {
    onNodeFocus: function onNodeFocus() {
      this.tree.activeElement = this.node;
    },

    focus: function focus() {
      this.$refs.anchor.focus();
    },

    check: function check() {
      if (this.node.checked()) {
        this.node.uncheck();
      } else {
        this.node.check();
      }
    },

    select: function select(ref) {
      if ( ref === void 0 ) ref = evnt;
      var ctrlKey = ref.ctrlKey;

      var opts = this.options;

      if (opts.checkbox && opts.checkOnSelect) {
        if (!opts.parentSelect && this.hasChildren()) {
          return this.toggleExpand()
        }

        return this.check(ctrlKey)
      }

      // 'parentSelect' behaviour.
      // For nodes which has a children list we have to expand/collapse
      if (!opts.parentSelect && this.hasChildren()) {
        return this.toggleExpand()
      }

      var tree = this.tree;
      var node = this.node;

      if (opts.multiple) {
        if (!node.selected()) {
          node.select(ctrlKey);
        } else {
          if (ctrlKey) {
            node.unselect();
          } else {
            tree.unselectAll();
            node.select();
          }
        }
      } else {
        if (node.selected()) {
          node.unselect();
        } else {
          node.select();
        }
      }
    },

    toggleExpand: function toggleExpand() {
      if (this.hasChildren()) {
        this.node.toggleExpand();
      }
    },

    hasChildren: function hasChildren() {
      return this.node.hasChildren()
    }
  }
};

function recurseDown(obj, fn) {
  var res;

  if (Array.isArray(obj)) {
    return obj.map(function (node) { return recurseDown(node, fn); })
  }

  res = fn(obj);

  // Recurse children
  if (res !== false && obj.hasChildren()) {
      res = recurseDown(obj.children, fn);
  }

  return res;
}

var $div = document.createElement('div');

function finder(criteria) {
  return function(node) {
    return Object.keys(criteria).some(function (key) {
      var val = node[key];
      var c = getRegExp(criteria[key]);

      if ('text' == key) {
        $div.innerHTML = val;
        val = $div.innerText;
      }

      console.log(val, c.test(val));

      return c.test(val)
    })
  }
}

function getRegExp(val) {
  if (val instanceof RegExp) {
    return val
  }

  return new RegExp(("^" + val + "$"), 'g')
}

function getAllChildren(source) {
  var result = [];

  source.forEach(function collect(node) {
    result.push(node);

    if (node.children) {
      node.children.forEach(collect);
    }
  });

  return result
}


function find(source, criteria, deep) {
  if ( deep === void 0 ) deep = true;

  if (!source || !source.length) {
    return null
  }

  if (deep) {
    source = getAllChildren(source);
  }

  // find by index
  if ('number' == typeof criteria) {
    return source[criteria] || null
  }

  if ('string' == typeof criteria || criteria instanceof RegExp) {
    criteria = {
      text: criteria
    };
  }

  if ('function' != typeof criteria) {
    criteria = finder(criteria);
  }

  var result = source.filter(criteria);

  if (result.length) {
    return result[0]
  }

  return null
}

var Node = function Node(tree, item) {
  this.id = item.id;
  this.states = item.state;

  this.children = item.children || [];
  this.parent = item.parent || null;

  this._data = Object.assign({}, {
    text: item.text
  }, item.data || {});

  if (!tree) {
    throw new Error('Node must has a Tree context!')
  }

  this.tree = tree;
};

var prototypeAccessors = { depth: { configurable: true },text: { configurable: true } };

Node.prototype.$emit = function $emit (evnt) {
    var ref;

    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
  (ref = this.tree).$emit.apply(ref, [ ("node:" + evnt), this ].concat( args ));
};

prototypeAccessors.depth.get = function () {
  var depth = 0;
  var parent = this.parent;

  if (!parent) {
    return depth
  }

  do {
    depth++;
  } while(parent = parent.parent)

  return depth
};

prototypeAccessors.text.get = function () {
  return this.data('text')
};

prototypeAccessors.text.set = function (text) {
  var oldText = this.text;

  this.data('text', text);
  this.tree.$emit('node:text:changed', text, oldText);
};

Node.prototype.data = function data (name, value) {
  if (undefined === value) {
    return this._data[name]
  }

  this._data[name] = value;
  return this
};

Node.prototype.state = function state (name, value) {
  if (undefined === value) {
    return this.states[name]
  }

  // TODO: check if it for example `selectable` state it should unselect node

  this.states[name] = value;

  return this
};

Node.prototype.recurseUp = function recurseUp (fn, node) {
    if ( node === void 0 ) node = this;

  if (!node.parent) {
    return
  }

  if (false !== fn(node.parent)) {
    return this.recurseUp(fn, node.parent)
  }
};

Node.prototype.recurseDown = function recurseDown$1 (fn, ignoreThis) {
  if (true !== ignoreThis) {
    fn(this);
  }

  if (this.hasChildren()) {
    recurseDown(this.children, fn);
  }
};

Node.prototype.refreshIndeterminateState = function refreshIndeterminateState () {
  if (!this.tree.options.autoCheckChildren) {
    return this
  }

  this.state('indeterminate', false);

  if (this.hasChildren()) {
    var childrenCount = this.children.length;
    var checked = 0;
    var indeterminate = 0;
    var disabled = 0;

    this.children.forEach(function (child) {
      if (child.checked()) {
        checked++;
      }

      if (child.disabled()) {
        disabled++;
      }

      if (child.indeterminate()) {
        indeterminate++;
      }
    });

    if (checked == childrenCount - disabled) {
      if (!this.checked()) {
        this.state('checked', true);
        this.$emit('checked');
      }
    } else {
      if (this.checked()) {
        this.state('checked', false);
        this.$emit('unchecked');
      }

      this.state(
        'indeterminate',
        indeterminate > 0 || (checked > 0 && checked < childrenCount)
      );
    }
  }

  if (this.parent) {
    this.parent.refreshIndeterminateState();
  }
};


Node.prototype.indeterminate = function indeterminate () {
  return this.state('indeterminate')
};


Node.prototype.selectable = function selectable () {
  return !this.state('disabled') && this.state('selectable')
};

Node.prototype.selected = function selected () {
  return this.state('selected')
};

Node.prototype.select = function select (extendList) {
  if (!this.selectable() || this.selected()) {
    return this
  }

  this.tree.select(this, extendList);

  this.state('selected', true);
  this.$emit('selected');

  return this
};

Node.prototype.unselect = function unselect () {
  if (!this.selectable() || !this.selected()) {
    return this
  }

  this.tree.unselect(this);

  this.state('selected', false);
  this.$emit('unselected');

  return this
};



Node.prototype.checked = function checked () {
  return this.state('checked')
};

Node.prototype.check = function check () {
    var this$1 = this;

  if (this.checked() || this.disabled()) {
    return this
  }

  if (this.indeterminate()) {
    return this.uncheck()
  }

  if (this.tree.options.autoCheckChildren) {
    this.recurseDown(function (node) {
      node.state('indeterminate', false);

      if (!node.checked()) {
        this$1.tree.check(node);

        node.state('checked', true);
        node.$emit('checked');
      }
    });

    if (this.parent) {
      this.parent.refreshIndeterminateState();
    }
  } else {
    this.tree.check(this);

    this.state('checked', true);
    this.$emit('checked');
  }

  return this
};

Node.prototype.uncheck = function uncheck () {
    var this$1 = this;

  if (!this.indeterminate() && !this.checked() || this.disabled()) {
    return this
  }

  if (this.tree.options.autoCheckChildren) {
    this.recurseDown(function (node) {
      node.state('indeterminate', false);

      if (node.checked()) {
        this$1.tree.uncheck(node);

        node.state('checked', false);
        node.$emit('unchecked');
      }
    });

    if (this.parent) {
      this.parent.refreshIndeterminateState();
    }
  } else {
    this.tree.uncheck(this);

    this.state('checked', false);
    this.$emit('unchecked');
  }

  return this
};



Node.prototype.show = function show () {
  if (this.visible()) {
    return this
  }

  this.state('visible', true);
  this.$emit('shown');

  return this
};

Node.prototype.hide = function hide () {
  if (this.hidden()) {
    return this
  }

  this.state('visible', false);
  this.$emit('hidden');

  return this
};

Node.prototype.visible = function visible () {
  return this.state('visible')
};

Node.prototype.hidden = function hidden () {
  return !this.state('visible')
};



Node.prototype.enable = function enable () {
  if (this.enabled()) {
    return this
  }

  this.recurseDown(function (node) {
    if (node.disabled()) {
      node.state('disabled', false);
      node.$emit('enabled');
    }
  });

  return this
};

Node.prototype.enabled = function enabled () {
  return !this.state('disabled')
};

Node.prototype.disable = function disable () {
  if (this.disabled()) {
    return this
  }

  this.recurseDown(function (node) {
    if (node.enabled()) {
      node.state('disabled', true);
      node.$emit('disabled');
    }
  });

  return this
};

Node.prototype.disabled = function disabled () {
  return this.state('disabled')
};


Node.prototype.expand = function expand () {
  if (!this.hasChildren() || this.expanded() || this.disabled()) {
    return this
  }

  this.state('expanded', true);
  this.$emit('expanded');

  return this
};

Node.prototype.expanded = function expanded () {
  return this.state('expanded')
};

Node.prototype.collapse = function collapse () {
  if (!this.hasChildren() || this.collapsed() || this.disabled()) {
    return this
  }

  this.state('expanded', false);
  this.$emit('collapsed');

  return this
};

Node.prototype.collapsed = function collapsed () {
  return !this.state('expanded')
};

Node.prototype.toggleExpand = function toggleExpand () {
  return this._toggleOpenedState()
};

Node.prototype.toggleCollapse = function toggleCollapse () {
  return this._toggleOpenedState()
};

Node.prototype._toggleOpenedState = function _toggleOpenedState () {
  if (this.disabled() || !this.hasChildren()) {
    return this
  }

  if (this.expanded()) {
    return this.collapse()
  }

  return this.expand()
};


Node.prototype.index = function index () {
  return this.tree.index(this)
};

Node.prototype.first = function first () {
  if (!this.hasChildren()) {
    return null
  }

  return this.children[0]
};

Node.prototype.last = function last () {
  if (!this.hasChildren()) {
    return null
  }

  return this.children[this.children.length - 1]
};

Node.prototype.next = function next () {
  return this.tree.nextNode(this)
};

Node.prototype.prev = function prev () {
  return this.tree.prevNode(this)
};


Node.prototype.insertAt = function insertAt (node, index) {
    if ( index === void 0 ) index = this.children.length;

  node = this.tree.objectToNode(node);
  node.parent = this;

  this.children.splice(
    index, 0, node
  );

  this.$emit('node:added', node);

  return node
};

Node.prototype.addChild = function addChild (node) {
  return this.insertAt(node)
};

Node.prototype.removeChild = function removeChild (criteria) {
  var node = this.find(criteria);

  if (node) {
    return this.tree.removeNode(node)
  }

  return null
};

Node.prototype.append = function append (node) {
  return this.addChild(node)
};

Node.prototype.prepend = function prepend (node) {
  return this.insertAt(node, 0)
};

Node.prototype.find = function find$1 (criteria, deep) {
  return find(this.children, criteria, deep)
};

Node.prototype.focus = function focus () {
  if (this.vm) {
    this.vm.focus();
  }
};

Node.prototype.hasChildren = function hasChildren () {
  return this.children.length > 0
};

/**
* Sometimes it's no need to have a parent. It possible to have more than 1 parent
*/
Node.prototype.isRoot = function isRoot () {
  return null === this.parent
};

Object.defineProperties( Node.prototype, prototypeAccessors );

// it is not genuine GUIDs

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function uuidV4() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

var nodeStates = {
  selected: false,
  selectable: true,
  checked: false,
  expanded: false,
  disabled: false,
  visible: true,
  indeterminate: false
};

function merge(state) {
  if ( state === void 0 ) state = {};

  return Object.assign({}, nodeStates, state)
}

function objectToNode(tree, obj) {
  var node = null;

  if (obj instanceof Node) {
    return obj
  }

  if ('string' == typeof obj) {
    node = new Node(tree, {
      text: obj,
      state: merge(),
      id: uuidV4()
    });
  } else {
    node = new Node(tree, obj);
    node.states = merge(node.states);

    if (!node.id) {
      node.id = uuidV4();
    }

    if (node.children.length) {
      node.children = node.children.map(function (child) {
        child = objectToNode(tree, child);
        child.parent = node;

        return child
      });
    }
  }

  return node
}

var List = (function (Array) {
  function List() {
    Array.call(this);
  }

  if ( Array ) List.__proto__ = Array;
  List.prototype = Object.create( Array && Array.prototype );
  List.prototype.constructor = List;

  List.prototype.empty = function empty () {
    this.splice(0, this.length);

    return this
  };

  List.prototype.add = function add () {
    var ref;

    var items = [], len = arguments.length;
    while ( len-- ) items[ len ] = arguments[ len ];
    (ref = this).push.apply(ref, items);

    return this
  };

  List.prototype.remove = function remove (item) {
    var index = this.indexOf(item);

    if (-1 == index) {
      return this
    }

    this.splice(index, 1);

    return this
  };

  List.prototype.removeAll = function removeAll (item) {
    var this$1 = this;

    while(this.includes(item)) {
      this$1.remove(item);
    }

    return this
  };

  List.prototype.top = function top () {
    return this[this.length - 1]
  };

  return List;
}(Array));

var defaultPropertyNames = {
  id: 'id',
  text: 'text',
  children: 'children',
  state: 'state',
  data: 'data'
};


function convertNames(obj, names) {
  return {
    id: obj[names.id],
    text: obj[names.text],
    children: obj[names.children],
    state: obj[names.state],
    data: obj[names.data]
  }
}


var TreeParser = {
  parse: function parse(data, tree, options) {
    if ( options === void 0 ) options = {};

    if ('string' == typeof data) {
      data = JSON.parse(data);
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    var p = Object.assign(
      {},
      defaultPropertyNames,
      options
    );

    var preparedItems = data.map(function converter(item) {
      var convertedItem = convertNames(item, p);

      // Possible to receive 1 child like a simple object. It must be converted to an array
      // We do not have checks on the correctness of the format. A developer should pass correct format
      if (convertedItem.children && !Array.isArray(convertedItem.children)) {
        convertedItem.children = [convertedItem.children];
      }

      if (convertedItem.children) {
        convertedItem.children = convertedItem.children.map(converter);
      }

      return convertedItem
    });

    return preparedItems.map(function (item) { return objectToNode(tree,item); })
  }
};

var Tree = function Tree(vm) {
  this.vm = vm;
  this.options = vm.options;

  this.activeElement = null;
};

Tree.prototype.$on = function $on (name) {
    var ref;

    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
  (ref = this.vm).$on.apply(ref, [ name ].concat( args ));
};

Tree.prototype.$once = function $once (name) {
    var ref;

    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
  (ref = this.vm).$once.apply(ref, [ name ].concat( args ));
};

Tree.prototype.$off = function $off (name) {
    var ref;

    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
  (ref = this.vm).$off.apply(ref, [ name ].concat( args ));
};

Tree.prototype.$emit = function $emit (name) {
    var ref;

    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
  (ref = this.vm).$emit.apply(ref, [ name ].concat( args ));
};


Tree.prototype.setModel = function setModel (model) {
    var this$1 = this;

  this.model = model;

  /**
  * VueJS transform properties to reactives when constructor is running
  * And we lose List object (extended from Array)
  */
  this.selectedNodes = new List;
  this.checkedNodes = new List;

  recurseDown(model, function (node) {
    node.tree = this$1;

    if (node.selected()) {
      this$1.selectedNodes.add(node);
    }

    if (node.checked()) {
      this$1.checkedNodes.add(node);

      if (node.parent) {
        node.parent.refreshIndeterminateState();
      }
    }
  });

  if (!this.options.multiple && this.selectedNodes.length) {
    var top = this.selectedNodes.top();

    this.selectedNodes.forEach(function (node) {
      if (top !== node) {
        node.state('selected', false);
      }
    });

    this.selectedNodes
      .empty()
      .add(top);
  }

  // Nodes can't be selected on init. By it's possible to select through API
  if (this.options.checkOnSelect && this.options.checkbox) {
    this.unselectAll();
  }
};

Tree.prototype.recurseDown = function recurseDown$1 (node, fn) {
  if (!fn && node) {
    fn = node;
    node = this.model;
  }

  return recurseDown(node, fn)
};


Tree.prototype.select = function select (node, extendList) {
  var treeNode = this.findNode(node);

  if (!treeNode) {
    return false
  }

  if (this.options.multiple && extendList) {
    this.selectedNodes.add(treeNode);
  } else {
    this.unselectAll();
    this.selectedNodes
      .empty()
      .add(treeNode);
  }

  return true
};

Tree.prototype.selectAll = function selectAll () {
    var this$1 = this;

  if (!this.options.multiple) {
    return false
  }

  this.selectedNodes.empty();

  this.recurseDown(function (node) {
    this$1.selectedNodes.add(
      node.select(true)
    );
  });

  return true
};

Tree.prototype.unselect = function unselect (node) {
  var treeNode = this.findNode(node);

  if (!treeNode) {
    return false
  }

  this.selectedNodes.remove(treeNode);

  return true
};

Tree.prototype.unselectAll = function unselectAll () {
  var node;

  while (node = this.selectedNodes.pop()) {
    node.unselect();
  }

  return true
};


Tree.prototype.check = function check (node) {
  this.checkedNodes.add(node);
};

Tree.prototype.uncheck = function uncheck (node) {
  this.checkedNodes.remove(node);
};

Tree.prototype.checkAll = function checkAll () {
  this.recurseDown(function (node) {
    if (0 == node.depth) {
      if (node.indeterminate()) {
        node.state('indeterminate', false);
      }

      node.check();
    }
  });
};

Tree.prototype.uncheckAll = function uncheckAll () {
  var node;

  while (node = this.checkedNodes.pop()) {
    node.uncheck();
  }

  return true
};


Tree.prototype.expand = function expand (node) {
  if (node.expanded()) {
    return false
  }

  node.expand();

  return true
};

Tree.prototype.collapse = function collapse (node) {
  if (node.collapsed()) {
    return false
  }

  node.collapse();

  return true
};

Tree.prototype.toggleExpand = function toggleExpand (node) {
  if (!node.hasChildren()) {
    return false
  }

  node.toggleExpand();

  return true
};

Tree.prototype.toggleCollapse = function toggleCollapse (node) {
  if (!node.hasChildren()) {
    return false
  }

  node.toggleCollapse();

  return true
};

Tree.prototype.expandAll = function expandAll () {
  this.recurseDown(function (node) {
    if (node.hasChildren() && node.collapsed()) {
      node.expand();
    }
  });
};

Tree.prototype.collapseAll = function collapseAll () {
  this.recurseDown(function (node) {
    if (node.hasChildren() && node.expanded()) {
      node.collapse();
    }
  });
};


Tree.prototype.index = function index (node, verbose) {
  var target = node.parent;

  if (target) {
    target = target.children;
  } else {
    target = this.model;
  }

  if (verbose) {
    return {
      index: target.indexOf(node),
      target: target
    }
  }

  return target.indexOf(node)
};

Tree.prototype.nextNode = function nextNode (node) {
  var ref = this.index(node, true);
    var target = ref.target;
    var index = ref.index;

  return target[index + 1] || null
};

Tree.prototype.nextVisibleNode = function nextVisibleNode (node) {
  if (node.hasChildren() && node.expanded()) {
    return node.first()
  }

  var nextNode = this.nextNode(node);

  if (!nextNode && node.parent) {
    return node.parent.next()
  }

  return nextNode
};

Tree.prototype.prevNode = function prevNode (node) {
  var ref = this.index(node, true);
    var target = ref.target;
    var index = ref.index;

  return target[index - 1] || null
};

Tree.prototype.prevVisibleNode = function prevVisibleNode (node) {
  var prevNode = this.prevNode(node);

  if (!prevNode) {
    return node.parent
  }

  if (prevNode.hasChildren() && prevNode.expanded()) {
    return prevNode.last()
  }

  return prevNode
};





Tree.prototype.addToModel = function addToModel (node, index) {
    var this$1 = this;
    if ( index === void 0 ) index = this.model.length;

  this.model.splice(index, 0, node);
  this.recurseDown(node, function (n) {
    n.tree = this$1;
  });
};


Tree.prototype.append = function append (node) {
  node = objectToNode(node);

  this.addToModel(node);

  return node
};

Tree.prototype.prepend = function prepend (node) {
  node = objectToNode(node);

  this.addToModel(node, 0);

  return node
};

Tree.prototype.addNode = function addNode (node) {
  var index = this.model.length;

  node = objectToNode(node);

  this.model.splice(index, 0, node);
  this.$emit('node:added', node);

  return node
};

Tree.prototype.removeNode = function removeNode (node) {
  if (!node.parent) {
    this.model.splice(
      this.model.indexOf(node),
      1
    );
  } else {
    node.parent.children.splice(
      node.parent.children.indexOf(node),
      1
    );
  }

  if (node.parent) {
    if (node.parent.indeterminate() && !node.parent.hasChildren()) {
      node.parent.state('indeterminate', false);
    }
  }

  this.$emit('node:removed', node);

  this.selectedNodes.remove(node);
  this.checkedNodes.remove(node);

  return node
};




Tree.prototype.isNode = function isNode (node) {
  return node instanceof Node
};


Tree.prototype.findNode = function findNode (node) {
  if ('string' == typeof node) {
    // find by id
  } else if (node instanceof Node){
    return node
  }
};

Tree.prototype.objectToNode = function objectToNode$1 (obj) {
  return objectToNode(this, obj)
};

Tree.prototype.parse = function parse (data, options) {
  if (!options) {
    options = this.options.propertyNames;
  }

  try {
    return TreeParser.parse(data, this, options)
  } catch(e) {
    console.error(e);
    return []
  }
};

var keyCodes = {
  'ARROW_LEFT': 37,
  'ARROW_TOP': 38,
  'ARROW_RIGHT': 39,
  'ARROW_BOTTOM': 40,
  'SPACE': 32
};

var codesArr = [37, 38, 39, 40, 32];


function focusUp(tree, node) {
  var prevNode = tree.prevVisibleNode(node);

  if (!prevNode) {
    return
  }

  if (prevNode.disabled()) {
    return focusUp(tree, prevNode)
  }

  prevNode.focus();
}

function focusdDown(tree, node) {
  var nextNode = tree.nextVisibleNode(node);

  if (!nextNode) {
    return
  }

  if (nextNode.disabled()) {
    return focusdDown(tree, nextNode)
  }

  nextNode.focus();
}

function checkNode(tree, node) {
  if (node.checked()) {
    tree.uncheck(node);
  } else {
    tree.check(node);
  }
}

function leftArrow(tree, node) {
  if (node.expanded()) {
    node.collapse();
  } else {
    var parent = node.parent;

    if (parent) {
      parent.focus();
    }
  }
}

function rightArrow(tree, node) {
  if (node.collapsed()) {
    node.expand();
  } else {
    var first = node.first();

    if (first) {
      first.focus();
    }
  }
}



function initKeyboardNavigation(tree) {
  var vm = tree.vm;
  var $el = vm.$el;

  $el.addEventListener('keydown', function (e) {
    var code = e.keyCode;
    var node = tree.activeElement;

    if (!tree.isNode(node)) {
      return
    }

    if (codesArr.includes(code)) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch(code) {
      case keyCodes.ARROW_LEFT: return leftArrow(tree, node)
      case keyCodes.ARROW_RIGHT: return rightArrow(tree, node)
      case keyCodes.ARROW_TOP: return focusUp(tree, node)
      case keyCodes.ARROW_BOTTOM: return focusdDown(tree, node)
      case keyCodes.SPACE: return checkNode(tree, node)
    }
  }, true);

}

var TreeMixin = {
  mounted: function mounted() {
    var tree = new Tree(this);

    this.model = tree.parse(this.data, this.options.modelParse);

    this.tree = tree;
    this.tree.setModel(this.model);

    this._provided.tree = tree;

    if (false !== this.options.keyboardNavigation) {
      initKeyboardNavigation(tree);
    }
  },

  methods: {
    selected: function selected() {
      if (this.options.multiple) {
        return this.tree.selectedNodes
      }

      return this.tree.selectedNodes[0] || null
    },

    checked: function checked() {
      if (!this.options.checkbox) {
        return null
      }

      return this.tree.checkedNodes
    },

    append: function append(node) {
      return this.tree.append(node)
    },

    prepend: function prepend(node) {
      return this.tree.prepend(node)
    },

    addNode: function addNode(node) {
      return this.tree.addNode(node)
    }
  }

};

(function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=" .tree { overflow: auto; } .tree-root, .tree-children { list-style: none; } .tree > .tree-root { padding: 0; } "; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();















var defaults = {
  multiple: true,
  checkbox: false,
  checkOnSelect: false,
  autoCheckChildren: true,
  parentSelect: false,
  keyboardNavigation: true
};

var TreeRoot = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tree",attrs:{"role":"tree"}},[_c('ul',{staticClass:"tree-root"},_vm._l((_vm.model),function(node,i){return (node.visible())?_c('node',{key:node.id,attrs:{"node":node,"options":_vm.options}}):_vm._e()}))])},staticRenderFns: [],
  name: 'Tree',
  components: {
    'node': TreeNode
  },

  mixins: [TreeMixin],

  provide: function (_) { return ({
    tree: null
  }); },

  props: {
    data: {
      type: Array,
      default: function (_) { return []; }
    },

    options: {
      type: Object,
      default: function (_) { return ({}); }
    }
  },

  data: function data() {
    var this$1 = this;

    // we should not mutating a prop directly...
    // that's why we add if it necessary
    for (var prop in defaults) {
      if ( false === (prop in this$1.options) ) {
        this$1.options[prop] = defaults[prop];
      }
    }

    return {
      model: null,
      tree: null
    }
  }
}

var install = function (Vue) {
  Vue.component(TreeRoot.name, TreeRoot);
};

TreeRoot.install = install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(TreeRoot);
}

return TreeRoot;

})));
//# sourceMappingURL=liquor-tree.umd.js.map