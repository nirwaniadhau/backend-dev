import {Router} from 'express';
import {upload} from '../middlewares/multer.js'
import {registerUser} from '../controllers/user.controller.js';
const router= Router();

console.log("registerUser:", typeof registerUser); // should log "function"
console.log("upload.fields:", typeof upload.fields); // should log "function"

router.route('/register').post( 
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  registerUser);
  
export default router;