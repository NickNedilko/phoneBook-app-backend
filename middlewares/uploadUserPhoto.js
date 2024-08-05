
const ImageService = require("../services/imageService");


// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1]
//         cb(null, `${req.user.id}-${nanoid()}.${ext}`)
//     }
// });

// const multerFilter = (req, file, cb) => {
    
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb( HttpError(400, 'Upload images only...'), false)
//     }
// }

exports.uploadUserPhoto = ImageService.upload('avatar');