import {
  createWorkflowService,
  getWorkflowsService,
  getWorkflowByIdService,
  updateWorkflowService,
  deleteWorkflowService,
  activateWorkflowService,
  deactivateWorkflowService,
  getWorkflowStatsService,
} from '../services/workflowService.js'

export const getWorkflowStats = async (req, res, next) => {
  try {
    const stats = await getWorkflowStatsService(req.user._id)
    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const createWorkflow = async (req, res, next) => {
  try {
    const workflow = await createWorkflowService(req.user._id, req.body)
    res.status(201).json({
      success: true,
      message: 'Workflow created successfully',
      data: { workflow },
    })
  } catch (error) {
    next(error)
  }
}

export const getWorkflows = async (req, res, next) => {
  try {
    const result = await getWorkflowsService(req.user._id, req.query)
    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getWorkflowById = async (req, res, next) => {
  try {
    const workflow = await getWorkflowByIdService(req.params.id, req.user._id)
    res.status(200).json({
      success: true,
      data: { workflow },
    })
  } catch (error) {
    next(error)
  }
}

export const updateWorkflow = async (req, res, next) => {
  try {
    const workflow = await updateWorkflowService(req.params.id, req.user._id, req.body)
    res.status(200).json({
      success: true,
      message: 'Workflow updated successfully',
      data: { workflow },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteWorkflow = async (req, res, next) => {
  try {
    const result = await deleteWorkflowService(req.params.id, req.user._id)
    res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    next(error)
  }
}

export const activateWorkflow = async (req, res, next) => {
  try {
    const workflow = await activateWorkflowService(req.params.id, req.user._id)
    res.status(200).json({
      success: true,
      message: 'Workflow activated successfully',
      data: { workflow },
    })
  } catch (error) {
    next(error)
  }
}

export const deactivateWorkflow = async (req, res, next) => {
  try {
    const workflow = await deactivateWorkflowService(req.params.id, req.user._id)
    res.status(200).json({
      success: true,
      message: 'Workflow deactivated successfully',
      data: { workflow },
    })
  } catch (error) {
    next(error)
  }
}

export const runWorkflowExecution = async (req, res, next) => {
  try {
    const { executeWorkflowService } = await import('../services/executionService.js')
    const result = await executeWorkflowService(req.params.id, req.user._id, req.body || {})
    res.status(200).json({
      success: true,
      message: 'Workflow executed successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
