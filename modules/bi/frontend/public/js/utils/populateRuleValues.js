// add additional rules for all the ones with string values
var async = require('async');
var Controller = require('../ajax/controller');
var _ = require('lodash');

var newRules = [];

function populateRuleValues(cb) {

	async.forEachOfSeries(window.config.Rules, function(rule, i, callback) {
		newRules.push(rule);
		Controller.getMetadata(i, rule.TimeGranularities[0], function(data) {
			if (data.values) {
				for (var i = 0; i < data.values.length; i++) {
					valueRule = _.extend({}, rule);
					valueRule.ValueType = data.values[i];
					valueRule.label = valueRule.ValueField + " - " + data.values[i];
					newRules.push(valueRule);
				}
			}
			callback();
		}, callback)
	}, function(err) {
		for (var i = 0; i < newRules.length; i++) {
		newRules[i].value = i;
	}
		window.config.Rules = newRules;
		cb(err);
	})

}

module.exports = populateRuleValues;
