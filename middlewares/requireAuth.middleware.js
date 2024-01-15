import { config } from '../config/index.js'
import { logger } from '../services/logger.service.js'
import { asyncLocalStorage } from '../services/als.service.js'
import { authService } from '../api/auth/auth.service.js'

export function requireAuth(req, res, next) {
    //const { loggedinUser } = asyncLocalStorage.getStore()
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    req.loggedinUser = loggedinUser

    if (config.isGuestMode && !loggedinUser) {
        req.loggedinUser = { _id: '', fullname: 'Guest' }
        return next()
    }
    if (!loggedinUser) return res.status(401).send('Not Authenticated')
    next()
}

export function requireAdmin(req, res, next) {
    //const { loggedinUser } = asyncLocalStorage.getStore()
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')
    if (!loggedinUser.isAdmin) {
        logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
        res.status(403).end('Not Authorized')
        return
    }
    req.loggedinUser = loggedinUser
    next()
}



