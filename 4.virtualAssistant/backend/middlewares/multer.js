import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    // FIX: Removed 'res'. It must be (req, file, cb)
    destination: (req, file, cb) => {
        cb(null, "./public"); 
    },
    filename: (req, file, cb) => {
        // Adding a timestamp to the name makes it unique
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });
export default upload;