let express = require('express');
let router = express.Router();

router.post('/funa', async (req, res, next) => {
  res.json('hello')
})

module.exports = router;