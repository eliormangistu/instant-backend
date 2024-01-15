import { storyService } from './story.service.js'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'

export async function getStorys(req, res) {
    // console.log(req, res)
    try {
        logger.debug('Getting Storys:', req.query)
        const filterBy = {
            txt: req.query.txt || '',
        }
        const storys = await storyService.query(filterBy)
        res.json(storys)
    } catch (err) {
        logger.error('Failed to get storys', err)
        res.status(400).send({ err: 'Failed to get storys' })
    }
}

export async function getStoryById(req, res) {
    try {
        const storyId = req.params.id
        const story = await storyService.getById(storyId)
        res.json(story)
    } catch (err) {
        logger.error('Failed to get story', err)
        res.status(400).send({ err: 'Failed to get story' })
    }
}

export async function addStory(req, res) {
    //const { loggedinUser } = req

    try {
        const story = req.body
        //story.by = loggedinUser
        const addedStory = await storyService.add(story)
        //socketService.broadcast({ type: 'story-added', data: addedStory, userId: loggedinUser._id })
        res.json(addedStory)
    } catch (err) {
        logger.error('Failed to add story', err)
        res.status(400).send({ err: 'Failed to add story' })
    }
}

export async function saveStory(req, res) {
    //const { loggedinUser } = req

    try {
        const story = req.body
        //story.by = loggedinUser
        const savedStory = await storyService.save(story)
        //socketService.broadcast({ type: 'story-added', data: addedStory, userId: loggedinUser._id })
        res.json(savedStory)
    } catch (err) {
        logger.error('Failed to add story', err)
        res.status(400).send({ err: 'Failed to add story' })
    }
}


export async function updateStory(req, res) {
    try {
        const story = req.body
        const updatedStory = await storyService.update(story)
        res.json(updatedStory)
    } catch (err) {
        logger.error('Failed to update story', err)
        res.status(400).send({ err: 'Failed to update story' })
    }
}

export async function removeStory(req, res) {
    const { loggedinUser } = req
    try {
        const storyId = req.params.id
        const removedId = await storyService.remove(storyId)
        //socketService.broadcast({ type: 'story-removed', data: storyId, userId: loggedinUser._id })
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove car', err)
        res.status(400).send({ err: 'Failed to remove car' })
    }
}

export async function notification(req, res) {
    console.log('notif conrol')
    try {
        const notif = req.body
        console.log(notif)
        socketService.emitToUser({ type: 'new-notif', data: notif, userId: notif.storyBy._id })
    } catch (err) {
        logger.error('Failed to send notification', err)
    }
}

export async function message(req, res) {
    console.log('msg conrol')
    try {
        const msg = req.body
        console.log(msg)
        socketService.emitToUser({ type: 'new-msg', data: msg.txt, userId: msg.to })
    } catch (err) {
        logger.error('Failed to send msg', err)
    }
}

// export async function addCarMsg(req, res) {
//     const { loggedinUser } = req
//     try {
//         const carId = req.params.id
//         const msg = {
//             txt: req.body.txt,
//             by: loggedinUser
//         }
//         const savedMsg = await storyService.addCarMsg(carId, msg)
//         res.json(savedMsg)
//     } catch (err) {
//         logger.error('Failed to update car', err)
//         res.status(400).send({ err: 'Failed to update car' })

//     }
// }

// export async function removeCarMsg(req, res) {
//     const { loggedinUser } = req
//     try {
//         const carId = req.params.id
//         const { msgId } = req.params

//         const removedId = await storyService.removeCarMsg(carId, msgId)
//         res.send(removedId)
//     } catch (err) {
//         logger.error('Failed to remove car msg', err)
//         res.status(400).send({ err: 'Failed to remove car msg' })

//     }
// }


