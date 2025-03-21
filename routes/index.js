const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //swagger.tags = ['Hello world'];
    res.render('./products')
  })
  
router.use('/products', require('./products'));

module.exports = router;