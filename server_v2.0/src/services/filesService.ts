import * as listingsRepo from "../repositories/listingsRepository";
import * as listingsPhotoRepo from "../repositories/listingPhotosRepository";
import { Listing } from "../../database/models/listing";
import { ListingPhoto } from "../../database/models/listingphoto";
import { NotFoundError } from "../errors/AppError";

export async function getPhotoWithListing(fileName: string): Promise<{ photo: ListingPhoto; listing: Listing }> {
    const photo = await listingsPhotoRepo.findPhotoByFileName(fileName);
    if (!photo) throw new NotFoundError('Photo not found');
    const listing = await listingsRepo.findListingById(photo.listingId);
    if (!listing) throw new NotFoundError('Photo not found');

    return { photo, listing };
}