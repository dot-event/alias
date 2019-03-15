/*prettier-ignore*/
"use strict"

module.exports = function(dot) {
  if (dot.args) {
    return
  }

  dot.state.args = {}

  dot.any("args", args)
}

function args(prop, arg, dot) {
  dot.state.args[prop[0]] = arg
  dot.any(prop[0], aliasArgs)
}

function aliasArgs(prop, arg, dot, eventId) {
  var args = dot.state.args

  if (!args[eventId]) {
    return
  }

  var eventAlias = args[eventId]

  for (var key in eventAlias) {
    if (!eventAlias[key]) {
      continue
    }

    var keys = eventAlias[key].concat([key]).sort()

    var value = keys.reduce(function(memo, k) {
      if (Array.isArray(arg[k])) {
        memo = !memo || Array.isArray(memo) ? memo : [memo]
        return arg[k].concat(memo || [])
      } else if (typeof arg[k] === "object") {
        return Object.assign(memo || {}, arg[k])
      } else if (arg[k]) {
        return arg[k]
      } else {
        return memo
      }
    }, undefined)

    if (value !== undefined) {
      keys.forEach(function(k) {
        arg[k] = value
      })
    }
  }
}