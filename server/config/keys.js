if(process.env.NODE_ENV==="production"){
    // console.log("working")
    module.exports = require('./prod')
}
else{
    module.exports = require('./dev')
}