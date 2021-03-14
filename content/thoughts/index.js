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
      data = JSON.parse(data)
      data.path = file
      console.log(JSON.stringify(data, 4))
      fs.writeFileSync(file, JSON.stringify(data, 4), function(err) {
        if (err) {
          console.log(err)
        }
        console.log("The file was saved!")
      })
      //   JSON.parse(data).path =
    })
  })
})
