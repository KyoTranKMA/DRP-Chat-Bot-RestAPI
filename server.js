'strict mode'
const app = require("./src/app.js");


const PORT = process.env.PORT || 3055;


const server = app.listen( PORT, () =>  {
    console.log(`Server Running at Port: ${PORT} `)
})


