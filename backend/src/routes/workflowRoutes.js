import express from 'express'
import {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  activateWorkflow,
  deactivateWorkflow,
  getWorkflowStats,
  runWorkflowExecution,
} from '../controllers/workflowController.js'
import { getWorkflowExecutions } from '../controllers/executionController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validateMiddleware.js'
import {
  createWorkflowSchema,
  updateWorkflowSchema,
} from '../validators/workflowValidator.js'

const router = express.Router()

// All workflow routes require authentication
router.use(protect)

router.get('/metrics/stats', getWorkflowStats)

router.route('/')
  .post(validate(createWorkflowSchema), createWorkflow)
  .get(getWorkflows)

router.route('/:id')
  .get(getWorkflowById)
  .patch(validate(updateWorkflowSchema), updateWorkflow)
  .delete(deleteWorkflow)

router.post('/:id/activate', activateWorkflow)
router.post('/:id/deactivate', deactivateWorkflow)
router.post('/:id/run', runWorkflowExecution)
router.get('/:workflowId/executions', getWorkflowExecutions)

export default router
