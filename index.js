const express = require('express')
const app = express()
const port = 5000 || process.env.PORT




app.get('/', (req, res) => {
    res.send('Hello From Action Shark')
})

app.listen(port, () => {
    console.log(`listening at :${port}`)
})