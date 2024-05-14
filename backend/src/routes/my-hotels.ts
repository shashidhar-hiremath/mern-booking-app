import express, { Request, Response} from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5mb

    }
})

router.post(
    `/`,
    verifyToken, [
        body('name').notEmpty().withMessage('Hotel name is required'), 
        body('city').notEmpty().withMessage('city is required'),
        body('country').notEmpty().withMessage('country is required'),
        body('description').notEmpty().withMessage('description is required'),
        body('type').notEmpty().withMessage('type is required'),
        body('adultCount').notEmpty().isNumeric().withMessage('adultCount is required and must be number'),
        body('childCount').notEmpty().isNumeric().withMessage('childCount is required and must be number'),
        body('facilities').notEmpty().isArray().withMessage('facilities is required'),
        body('pricePerNight').notEmpty().isNumeric().withMessage('pricePerNight is required  and must be number'),
        body('starRating').notEmpty().isNumeric().withMessage('starRating is required and must be number'), 
        // body('imageUrls').notEmpty().withMessage('Hotel name is required'),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            // upload image to cloudinary
            const images = await uploadImages(imageFiles);
            // if upload is successful upload url to mongo db
            newHotel.imageUrls = images;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;
            // save hotel to db
            const hotel = new Hotel(newHotel);
            await hotel.save();
            // success response
            res.status(201).send(hotel);
            
        } catch(error) {
            console.log("Error creating my hotels", error);
            res.status(500).json({ message: "Something went wrong while creating new hotel"});
        }
    }
);

router.get("/", verifyToken , async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching hotels.'});
    }
})


router.get("/:id", verifyToken , async (req: Request, res: Response) => {
    try {
        const id = req.params.id.toString();
        const hotel = await Hotel.findOne({ _id: id, userId: req.userId});
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching hotel details.'});
    }
})

router.put("/:hotelId", verifyToken , upload.array("imageFiles") ,async (req: Request, res: Response) => {
    try {
        const updatedDetails: HotelType = req.body;
        updatedDetails.lastUpdated = new Date();
        const id = req.params.hotelId.toString();
        const hotel = await Hotel.findOneAndUpdate(
            { _id: id, userId: req.userId},
            updatedDetails,
            {new: true}
        );

        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found."})
        }

        const files = req.files as Express.Multer.File[];

        const uplaodImagesUrls = await uploadImages(files);

        hotel.imageUrls = [...uplaodImagesUrls, ...(updatedDetails.imageUrls || [])];
        await hotel.save();
        
        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Error while edting hotel details.'});
    }
})

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const base64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + base64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });
    const images = await Promise.all(uploadPromises);
    return images;
}

export default router;