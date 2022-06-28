const UploadModel= require('../model/schema');
const fs = require('fs');
const { Promise } = require('mongoose');

exports.home = (req, res)=>{
    res.render('main');
}
exports.uploads = (req, res, next)=>{
    const files = req.files;

    if(!files){
        const error = new Error ("Please choose file");
        error.httpStatusCode = 400;
        return next(error)
    }

    // converted image into base64 encoding
    let imgArray = files.map((file)=>{
        let img = fs.readFileSync(file.path);

        return encode_image =  img.toString('base64');
    })

    let result = imgArray.map((src, index)=>{
        let finalImage = {
            filename:files[index].originalname,
            contentType:files[index].mimetype,
            imageBase64: src
        }

        let newUpload =new UploadModel (finalImage);
        return newUpload
                .save()
                .then(()=>{
                    return {msg :`${files[index].originalname} successfully uploaded`}
                })
                .catch(error =>{
                    if(error){
                        if(error.name==='MongoError' && error.code=== 11000){
                            return Promise.reject({error: `Duplicate ${files[index].originalname} Already exits`})
                        }
                        return Promise.reject({error: error.message || `cannot upload ${files[index].originalname} something is missing`}) 
                    }
                })
    })

    Promise.all(result)
    .then(msg =>{
        res.json(msg);
        // res.redirect('/');
    }).catch(error=>{
        res.json(error);
    })
}