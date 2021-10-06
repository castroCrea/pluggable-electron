/**
 * This object contains a register of {@link ExtensionPoint|extension points} and the means to work with them.
 * @namespace extensionPoints
 */

import ExtensionPoint from "./ExtensionPoint.js"

/** 
 * @constant {Object.<string, ExtensionPoint>} extensionPoints
 * @private
 * Register of extension points created by the consumer
 */
const _extensionPoints = {}

/**
 * Create new extension point and add it to the registry.
 * @param {string} name Name of the extension point.
 * @returns {void}
 * @alias extensionPoints.add
 */
export function add(name) {
  _extensionPoints[name] = new ExtensionPoint(name)
}

/**
 * Create extension point if it does not exist and then register the given extension to it.
 * @param {String} name Name of the extension point.
 * @param {String} extension Unique name for the extension.
 * @param {Object|Callback} response Object to be returned or function to be called by the extension point.
 * @param {Number} [priority=0] Order priority for execution used for executing in serial.
 * @returns {void}
 * @alias extensionPoints.register
 */
export function register(name, extension, response, priority) {
  if (!_extensionPoints.hasOwnProperty(name)) add(name)
  _extensionPoints[name].register(extension, response, priority)
}

/**
 * Fetch extension points by name, or all if no names are provided.
 * @param {Array.<string>} [eps] List of names of extension points to fetch
 * @returns {Array.<ExtensionPoint>} Found extension points
 * @alias extensionPoints.get
 */
export function get(eps) {
  if (!eps) return _extensionPoints
  return eps.reduce((res, name) => {
    if (typeof _extensionPoints[name] === 'object')
      res.push(_extensionPoints[name])
    return res
  }, [])
}

/**
 * Call all the extensions registered to an extension point synchronously. See execute on {@link ExtensionPoint}.
 * Call this at the point in the base code where you want it to be extended.
 * @param {string} name Name of the extension point to call
 * @param {*} [input] Parameter to provide to the extensions if they are a function
 * @returns {Array} Result of Promise.all or Promise.allSettled depending on exitOnError
 * @alias extensionPoints.execute
 */
export function execute(name, input) {
  if (typeof _extensionPoints[name] === 'object')
    return _extensionPoints[name].execute(input)
}

/**
 * Calls all the extensions registered to the extension point in serial. See executeSerial on {@link ExtensionPoint}
 * Call this at the point in the base code where you want it to be extended.
 * @param {string} name Name of the extension point to call
 * @param {*} [input] Parameter to provide to the extensions if they are a function
 * @returns {Promise.<*>} Result of the last extension that was called
 * @alias extensionPoints.executeSerial
 */
export function executeSerial(name, input) {
  if (typeof _extensionPoints[name] === 'object')
    return _extensionPoints[name].executeSerial(input)
}
