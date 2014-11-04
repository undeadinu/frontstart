'use strict';

function listToArray(list) {
  var arr = [];
  if (list.length) {
    for (var i = 0; i < list.length; i++) {
      arr.push(list[i]);
    }
  }
  return arr;
}

/**
 * Method to extend from current prototype.
 *
 * @param {Object} properties The object that serves as definition for the prototype that gets created for the new class. This object should always contain a constructor property that is the desired constructor for the newly created class.
 * @param {Object} [superProtoOverride] By default extends will use the current class prototype or Class. With this parameter you can specify any super prototype that will be used.
 * @returns {Function} Constructor function of the new class
 *
 * @example
 * var Fruit = Class.extend({
 * color: undefined,
 *   sugar: undefined,
 *
 *   constructor: function(color, sugar) {
 *     this.color = color;
 *     this.sugar = sugar;
 *   },
 *
 *   eat: function() {
 *     this.sugar = 0;
 *     return this;
 *   }
 * });
 *
 * var Banana = Fruit.extend({
 *   length: undefined,
 *
 *   constructor: function(length, sugar) {
 *     Banana.super.constructor.call(this, 'Yellow', sugar);
 *     this.length = length;
 *   }
 * });
 *
 * var banana = new Banana(20, 40);
 * console.log('banana instanceof Fruit', banana instanceof Fruit);
 * console.log('Fruit is prototype of banana', Fruit.prototype.isPrototypeOf(banana));
 * console.log('bananas\'s prototype is Fruit', Object.getPrototypeOf(banana) === Fruit.prototype);
 * console.log(banana.sugar);
 * console.log(banana.eat().sugar);
 * console.log(banana.color);
 */
exports.extend = function(properties, superProtoOverride) {
  var superProto = superProtoOverride || this.prototype || exports;
  var proto = Object.create(superProto);

  exports.cloneDefinitions(proto, properties);

  var constr = function constr() {
    var fn = proto.constructor || function () {};
    fn.apply(this, Array.prototype.slice.call(arguments, 0));
  };

  constr.prototype = proto;
  constr.super = superProto;
  constr.extend = this.extend;

  return constr;
};

/**
 * Creates a mixin from multiple super prototypes.
 *
 * @param {Array} mixProtoArr An array of super prototypes or an array of super prototype constructors.
 * @param {Object} properties The object that serves as definition for the prototype that gets created for the new class. This object should always contain a constructor property that is the desired constructor for the newly created class.
 * @returns {Function} Constructor function of the newly created mixin class
 *
 * @example
 * var Fruit = Class.extend({
 * color: undefined,
 *   sugar: undefined,
 *
 *   constructor: function(color, sugar) {
 *     this.color = color;
 *     this.sugar = sugar;
 *   },
 *
 *   eat: function() {
 *     this.sugar = 0;
 *     return this;
 *   }
 * });
 *
 * var Banana = Fruit.extend({
 *   length: undefined,
 *
 *   constructor: function(length, sugar) {
 *     Banana.super.constructor.call(this, 'Yellow', sugar);
 *     this.length = length;
 *   }
 * });
 *
 * var banana = new Banana(20, 40);
 * console.log('banana instanceof Fruit', banana instanceof Fruit);
 * console.log('Fruit is prototype of banana', Fruit.prototype.isPrototypeOf(banana));
 * console.log('bananas\'s prototype is Fruit', Object.getPrototypeOf(banana) === Fruit.prototype);
 * console.log(banana.sugar);
 * console.log(banana.eat().sugar);
 * console.log(banana.color);
 *
 *
 * var KCal = Class.extend({
 *   sugar: 0,
 *
 *   constructor: function(sugar) {
 *     this.sugar = sugar;
 *   },
 *
 *   get kcal() {
 *     return [this.sugar * 4, 'kcal'].join('');
 *   }
 * });
 *
 *      var Nameable = Class.extend({
 *   name: undefined,
 *
 *   constructor: function(name) {
 *     this.name = name;
 *   }
 * });
 *
 * var NameableKCalBanana = Class.mix([Banana, KCal, Nameable], {
 *   constructor: function(name, length, sugar) {
 *     Nameable.prototype.constructor.call(this, name);
 *     Banana.prototype.constructor.call(this, length, sugar);
 *   },
 *
 *   toString: function() {
 *     return [this.name, 'with', this.length + 'cm', 'and', this.kcal].join(' ');
 *   }
 * });
 *
 *
 *
 * var banana = new Banana(20, 40);
 * console.log('banana instanceof Fruit', banana instanceof Fruit);
 * console.log('Fruit is prototype of banana', Fruit.prototype.isPrototypeOf(banana));
 * console.log('bananas\'s prototype is Fruit', Object.getPrototypeOf(banana) === Fruit.prototype);
 * console.log(banana.sugar);
 * console.log(banana.eat().sugar);
 * console.log(banana.color);
 *
 * var superBanana = new NameableKCalBanana('Super Mixin Banana', 30, 80);
 * console.log(superBanana.toString());
 *
 */
exports.mix = function(mixProtoArr, properties) {
  if(this !== exports) {
    throw new Error('Class.mix should only be called on the type and never on an instance!');
  }

  // Make sure our mixin prototypes are the class objects and not the constructors
  var superPrototypes = [{}]
    .concat(mixProtoArr)
    .map(function getPrototype(prototype) {
      return prototype instanceof Function ? prototype.prototype : prototype;
    });

  var mixedSuperProto = exports.cloneDefinitions.apply(undefined, superPrototypes);
  // Delete the constructor if present because we don't want to invoke a constructor on a mixed prototype
  delete mixedSuperProto.constructor;
  return this.extend(properties, mixedSuperProto);
};

// Variable argument list clones args > 0 into args[0] and retruns modified args[0]
exports.cloneDefinitions = function() {
  var args = listToArray(arguments);
  var target = args[0];

  args.splice(1, args.length - 1).forEach(function allDefinitions(source) {
    Object.getOwnPropertyNames(source).forEach(function cloneIntoTarget(propName) {
      // If this property already exist in target we delete it first
      delete target[propName];
      // Define the property with the descriptor from source
      Object.defineProperty(target, propName,
        Object.getOwnPropertyDescriptor(source, propName));
    });
  });

  return target;
};
