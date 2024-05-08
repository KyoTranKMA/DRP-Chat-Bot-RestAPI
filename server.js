'strict mode'
const app = require("./src/index");

const PORT = process.env.PORT || 3055;


const server = app.listen( PORT, () =>  {
    console.log(`Server Running at: http://localhost:${PORT} `)
})

