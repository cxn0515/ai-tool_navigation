const { sendJson } = require('./_db')

module.exports = function handler(req, res) {
  sendJson(res, 200, { status: 'ok' })
}
