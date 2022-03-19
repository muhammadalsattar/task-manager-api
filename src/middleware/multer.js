const multer = require('multer')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return callback(new Error('File type unspported!'), false)
        }
        return callback(null, true)
    }
})

module.exports = upload