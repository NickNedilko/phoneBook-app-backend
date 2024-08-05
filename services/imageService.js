const multer = require('multer');
const path = require('path');

const { nanoid } = require("nanoid");
require("dotenv").config();
const fse = require("fs-extra")
const sharp = require('sharp');

const { HttpError } = require('../helpers');


class ImageService {
    static upload(name) {
        const multerStorage = multer.memoryStorage()
    
    const multerFilter = (req, file, cb) => {
    
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb( HttpError(400, 'Upload images only...'), false)
    }
        }
        return multer({
            storage: multerStorage,
            fileFilter: multerFilter
        }).single(name) 
    }

    static async save(file, options, ...pathSegments) {
        const fileName = `${nanoid()}.jpeg`;
        const filePath = path.join(process.cwd(), 'public', ...pathSegments)
        await fse.ensureDir(filePath);
        await sharp(file.buffer)
            .resize(options || { height: 500, width: 500 })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(filePath, fileName));
        
        return path.join(...pathSegments, fileName)
    }

}


module.exports = ImageService;
