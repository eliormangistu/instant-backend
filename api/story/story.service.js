import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb


async function query(filterBy = { txt: '' }) {
    try {
        const criteria = {
            username: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('story')
        var StoryCursor = await collection.find({})
        const storys = StoryCursor.toArray()
        return storys
    } catch (err) {
        logger.error('cannot find storys', err)
        throw err
    }
}

async function getById(storyId) {
    try {
        const collection = await dbService.getCollection('story')
        const story = collection.findOne({ _id: ObjectId(storyId) })
        return story
    } catch (err) {
        logger.error(`while finding story ${storyId}`, err)
        throw err
    }
}

async function remove(storyId) {
    try {
        const collection = await dbService.getCollection('story')
        await collection.deleteOne({ _id: ObjectId(storyId) })
        return storyId
    } catch (err) {
        logger.error(`cannot remove story ${storyId}`, err)
        throw err
    }
}

async function add(story) {
    try {
        const collection = await dbService.getCollection('story')
        await collection.insertOne(story)
        return story
    } catch (err) {
        logger.error('cannot insert story', err)
        throw err
    }
}

async function update(story) {
    try {
        const storyToSave = {
            txt: story.txt,
        }
        const collection = await dbService.getCollection('story')
        await collection.updateOne({ _id: ObjectId(story._id) }, { $set: storyToSave })
        return story
    } catch (err) {
        logger.error(`cannot update story ${story._id}`, err)
        throw err
    }
}

async function save(story) {
    try {
        const storyToSave = {
            txt: story.txt,
            comments: story.comments,
            likedBy: story.likedBy,
        }
        const collection = await dbService.getCollection('story')
        await collection.updateOne({ _id: ObjectId(story._id) }, { $set: storyToSave })
        return story
    } catch (err) {
        logger.error(`cannot update story ${story._id}`, err)
        throw err
    }
}

// async function addCarMsg(carId, msg) {
//     try {
//         msg.id = utilService.makeId()
//         const collection = await dbService.getCollection('car')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $push: { msgs: msg } })
//         return msg
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }

// async function removeCarMsg(carId, msgId) {
//     try {
//         const collection = await dbService.getCollection('car')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $pull: { msgs: { id: msgId } } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }

export const storyService = {
    remove,
    query,
    getById,
    add,
    update,
    save,
    //addCarMsg,
    //removeCarMsg
}
