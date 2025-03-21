const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //swagger.tags = ['Hello world'];
    res.render('./contacts')
  })
  
router.use('/contacts', require('./contacts'));

module.exports = router;