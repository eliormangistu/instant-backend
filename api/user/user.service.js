import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

export const userService = {
    add,            // Create (Signup)
    getById,        // Read (Profile page)
    update,         // Update (Edit profile)
    remove,         // Delete (remove user)
    query,          // List (of users)
    getByUsername   // Used for Login
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)

    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password

            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}


async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user

    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    console.log('user', user)
    try {
        // peek only updatable properties
        const userToSave = {
            following: user.following,
            followers: user.followers,
            savedStoryIds: user.savedStoryIds,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: ObjectId(user._id) }, { $set: userToSave })
        return user
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}




