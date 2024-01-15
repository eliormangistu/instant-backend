import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getStorys, getStoryById, addStory, removeStory, updateStory, saveStory, notification, message } from './story.controller.js'
const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getStorys)
router.get('/:id', getStoryById)
router.put('/:id', requireAuth, saveStory)
router.post('/', requireAuth, addStory)
router.put('/:id', requireAuth, updateStory)
router.delete('/:id', requireAuth, removeStory)
router.post('/notification', notification)
router.post('/message', message)
//router.delete('/:id', requireAuth, removeStory)

//router.post('/:id/msg', requireAuth, addCarMsg)
//router.delete('/:id/msg/:msgId', requireAuth, removeCarMsg)


export const storyRoutes = router
