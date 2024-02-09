import Collection from "../models/collection.schema";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";

export const createCollection = asyncHandler( async(req,res) => {
    const {name} = req.body

    if(!name){
        throw new customError("Please enter the name of the collection", 400)
    }

    const collection = await Collection.create({
        name
    })

    res.status(200).json({
        success: true,
        message: "Collection created",
        collection
    })
})

export const updateCollection = asyncHandler( async(req,res) => {
    const {id: collectionId} = req.params
    const {name} = req.body

    if(!name){
        throw new customError("Enter the new collection name", 400)
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!updatedCollection){
        throw new customError("Collection name not found", 400)
    }

    res.status(200).json({
        success: true,
        message: "collection updated successfully",
        updateCollection
    })

})

export const deleteCollection = asyncHandler( async(req,res) => {
    const {id: collectionId} = req.params 

    const deletedCollection = await Collection.findByIdAndDelete(collectionId)
        
    if(!deletedCollection){    
        throw new customError("Cannot be Deleted", 400)
    }

    res.status(200).json({
        success: true,
        message: "Collection deleted successfully"
    })
})

export const collectionList = asyncHandler( async(req,res) => {

    const list = await Collection.find()

    if(!list){
        throw new customError("No collection found", 400)
    }

    res.status(200).json({
        success: true,
        list
    })
})