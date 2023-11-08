const express = require('express')
const router = express.Router();

router.get('/', (req, res)=> {
    const obj = {
        title: 'Now Its time to write!',
        description: `Let's create something best?` 
    }
    res.json(obj)
})

module.exports = router