const testFolder = "./"
const fs = require("fs")
const base64 = require("hi-base64")
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    fs.readFile(file, (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      //   data = data.replace("\n", "\\n")
      //   data = base64.decode(data)
      console.log(JSON.parse(data).path)
      data = JSON.parse(data)
      data.path = file
      fs.writeFile(file, JSON.stringify(data), function(err) {
        if (err) {
          return console.log(err)
        }
        console.log("The file was saved!")
      })
      //   JSON.parse(data).path =
    })
  })
})
