import {Router} from 'express';
import {upload} from '../middlewares/multer.js'
import {loginUser, logoutUser, registerUser} from '../controllers/user.controller.js';
const router= Router();
import {VerifyJwt} from "../middlewares/auth.middleware.js"
console.log("registerUser:", typeof registerUser); // should log "function"
console.log("upload.fields:", typeof upload.fields); // should log "function"

router.route('/register').post( 
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  registerUser);


router.route("/login").post(loginUser)

//secured routes 
router.route("/logout").post(VerifyJwt,logoutUser)


  
export default router;