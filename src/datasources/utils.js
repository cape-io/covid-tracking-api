const _ = require('lodash/fp')
const { addHours, formatISO, parse } = require('date-fns/fp')
const { zonedTimeToUtc } = require('date-fns-tz/fp')
const { setFieldWith } = require('prairie')
const { fipsByCode, nameByCode } = require('./stateNames')

const toDate = _.flow(
  zonedTimeToUtc('America/New_York'),
  formatISO,
)
function tryParse(templateStr) {
  return (dateStr) => {
    try {
      return parse(new Date(), templateStr, dateStr)
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

const dailyDate = _.flow(
  tryParse('yyyyMMdd'),
  addHours(16),
  toDate,
)
const totalDate = _.flow(
  tryParse('M/dd HH:mm'),
  toDate,
)
const screenshotDate = _.flow(
  // remove all letters.
  _.replace(/^[a-zA-Z]+/, ''),
  tryParse('yyyyMMddHHmmss'),
  toDate,
)
const addName = setFieldWith('name', 'state', nameByCode)
const addFips = setFieldWith('fips', 'state', fipsByCode)

module.exports = {
  addFips,
  addName,
  dailyDate,
  screenshotDate,
  totalDate,
}
