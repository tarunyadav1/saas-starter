import { Router } from 'express'
import { logger } from '../utils/logger'

export const webhooks = Router()

webhooks.post('/wavespeed', async (req, res) => {
    logger.info('Wavespeed webhook received', req.body)
    res.status(200).send('OK')
})