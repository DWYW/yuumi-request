const http = require("http")
const url = require("url")
const fs = require("fs")

const server = http.createServer(function (req, res) {
  const { pathname, query } = url.parse(req.url)
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,content-type")
  res.setHeader("Access-Control-Allow-Origin", "*")

  setTimeout(() => {
    res.end("ok" + pathname)
  }, 3000)
})

server.listen(8002, () => {
  console.log("listen 8002")
})