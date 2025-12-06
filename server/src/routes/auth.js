const router = require('express').Router();
router.get('/', (req,res)=> res.json({msg: 'auth placeholder'}));
module.exports = router;
