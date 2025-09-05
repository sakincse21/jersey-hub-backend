import { CloudinaryStorage } from 'multer-storage-cloudinary';
//frontend(form data with image file)->multer(formdata->body+file in request)->multer keeps the file in a folder also copies the file into its own folder->cloudinary(req.file) niye url provide korbe->mongodb url store
import multer from "multer";
import { cloudinaryUpload } from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      //my image.png -> uniquechars-my-image.png
      const fileName = file.originalname.toLocaleLowerCase()
      .replace(/\s+/g, "-") //removes empty space and places dash
      .replace(/\./g, "-") //removes dot and places dash
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-\.]/g, "") //removes signs
      const extension=file.originalname.split('.').pop()
      const uniqueFileName = Math.random().toString(36).substring(2)+"-"+Date.now()+"-"+fileName+"."+extension;
      return uniqueFileName
    },
  },
});

export const multerUpload = multer({storage: storage})