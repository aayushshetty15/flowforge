import Workflow from '../models/Workflow.js'
import Webhook from '../models/Webhook.js'
import Execution from '../models/Execution.js'

export const createWorkflowService = async (userId, workflowData) => {
  const { name, description, nodes, edges, status, webhookEnabled } = workflowData

  // Detect if nodes contain a webhook trigger node
  const hasWebhookNode = Array.isArray(nodes) && nodes.some(
    (node) => node.type === 'webhook' || node.type === 'webhookTrigger' || node.data?.type === 'webhook'
  )

  const isWebhookActive = Boolean(webhookEnabled || hasWebhookNode)

  const workflow = await Workflow.create({
    name,
    description: description || '',
    userId,
    nodes: nodes || [],
    edges: edges || [],
    status: status || 'draft',
    webhookEnabled: isWebhookActive,
  })

  // Create an associated Webhook record if webhook is enabled or webhook node exists
  let webhook = null
  if (isWebhookActive) {
    webhook = await Webhook.create({
      workflowId: workflow._id,
      active: workflow.status === 'active',
    })
  }

  const workflowObj = workflow.toObject()
  if (webhook) {
    workflowObj.webhook = {
      id: webhook._id,
      token: webhook.token,
      active: webhook.active,
      lastTriggeredAt: webhook.lastTriggeredAt,
    }
  }

  return workflowObj
}

export const getWorkflowsService = async (userId, query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10))
  const skip = (page - 1) * limit

  // Ownership filter is strictly applied
  const filter = { userId }

  if (query.status && ['draft', 'active', 'inactive'].includes(query.status)) {
    filter.status = query.status
  }

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i')
    filter.$or = [{ name: searchRegex }, { description: searchRegex }]
  }

  const [workflows, total] = await Promise.all([
    Workflow.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Workflow.countDocuments(filter),
  ])

  // Attach webhook info if applicable
  const workflowIds = workflows.map((w) => w._id)
  const webhooks = await Webhook.find({ workflowId: { $in: workflowIds } }).lean()
  const webhookMap = new Map(webhooks.map((wh) => [wh.workflowId.toString(), wh]))

  const populatedWorkflows = workflows.map((wf) => {
    const wh = webhookMap.get(wf._id.toString())
    return {
      ...wf,
      webhook: wh
        ? {
            id: wh._id,
            token: wh.token,
            active: wh.active,
            lastTriggeredAt: wh.lastTriggeredAt,
          }
        : null,
    }
  })

  return {
    workflows: populatedWorkflows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  }
}

export const getWorkflowByIdService = async (workflowId, userId) => {
  const workflow = await Workflow.findById(workflowId).lean()

  if (!workflow) {
    const error = new Error('Workflow not found')
    error.statusCode = 404
    throw error
  }

  // Ownership validation
  if (workflow.userId.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You do not own this workflow')
    error.statusCode = 403
    throw error
  }

  const webhook = await Webhook.findOne({ workflowId }).lean()
  if (webhook) {
    workflow.webhook = {
      id: webhook._id,
      token: webhook.token,
      active: webhook.active,
      lastTriggeredAt: webhook.lastTriggeredAt,
    }
  }

  return workflow
}

export const updateWorkflowService = async (workflowId, userId, updateData) => {
  const workflow = await Workflow.findById(workflowId)

  if (!workflow) {
    const error = new Error('Workflow not found')
    error.statusCode = 404
    throw error
  }

  // Ownership validation
  if (workflow.userId.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You do not own this workflow')
    error.statusCode = 403
    throw error
  }

  // Apply updates
  if (updateData.name !== undefined) workflow.name = updateData.name
  if (updateData.description !== undefined) workflow.description = updateData.description
  if (updateData.nodes !== undefined) workflow.nodes = updateData.nodes
  if (updateData.edges !== undefined) workflow.edges = updateData.edges
  if (updateData.status !== undefined) workflow.status = updateData.status

  const hasWebhookNode =
    Array.isArray(workflow.nodes) &&
    workflow.nodes.some(
      (node) => node.type === 'webhook' || node.type === 'webhookTrigger' || node.data?.type === 'webhook'
    )

  if (updateData.webhookEnabled !== undefined) {
    workflow.webhookEnabled = updateData.webhookEnabled || hasWebhookNode
  } else if (hasWebhookNode) {
    workflow.webhookEnabled = true
  }

  await workflow.save()

  // Sync associated webhook
  let webhook = await Webhook.findOne({ workflowId: workflow._id })
  if (workflow.webhookEnabled) {
    if (!webhook) {
      webhook = await Webhook.create({
        workflowId: workflow._id,
        active: workflow.status === 'active',
      })
    } else {
      webhook.active = workflow.status === 'active'
      await webhook.save()
    }
  } else if (webhook) {
    webhook.active = false
    await webhook.save()
  }

  const result = workflow.toObject()
  if (webhook) {
    result.webhook = {
      id: webhook._id,
      token: webhook.token,
      active: webhook.active,
      lastTriggeredAt: webhook.lastTriggeredAt,
    }
  }

  return result
}

export const deleteWorkflowService = async (workflowId, userId) => {
  const workflow = await Workflow.findById(workflowId)

  if (!workflow) {
    const error = new Error('Workflow not found')
    error.statusCode = 404
    throw error
  }

  // Ownership validation
  if (workflow.userId.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You do not own this workflow')
    error.statusCode = 403
    throw error
  }

  // Delete workflow and associated records
  await Promise.all([
    Workflow.findByIdAndDelete(workflowId),
    Webhook.deleteMany({ workflowId }),
    Execution.deleteMany({ workflowId }),
  ])

  return { message: 'Workflow and associated resources deleted successfully' }
}

export const activateWorkflowService = async (workflowId, userId) => {
  const workflow = await Workflow.findById(workflowId)

  if (!workflow) {
    const error = new Error('Workflow not found')
    error.statusCode = 404
    throw error
  }

  // Ownership validation
  if (workflow.userId.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You do not own this workflow')
    error.statusCode = 403
    throw error
  }

  workflow.status = 'active'
  await workflow.save()

  // Ensure webhook is active if workflow has one
  let webhook = await Webhook.findOne({ workflowId: workflow._id })
  if (webhook) {
    webhook.active = true
    await webhook.save()
  } else if (workflow.webhookEnabled) {
    webhook = await Webhook.create({
      workflowId: workflow._id,
      active: true,
    })
  }

  const result = workflow.toObject()
  if (webhook) {
    result.webhook = {
      id: webhook._id,
      token: webhook.token,
      active: webhook.active,
      lastTriggeredAt: webhook.lastTriggeredAt,
    }
  }

  return result
}

export const deactivateWorkflowService = async (workflowId, userId) => {
  const workflow = await Workflow.findById(workflowId)

  if (!workflow) {
    const error = new Error('Workflow not found')
    error.statusCode = 404
    throw error
  }

  // Ownership validation
  if (workflow.userId.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You do not own this workflow')
    error.statusCode = 403
    throw error
  }

  workflow.status = 'inactive'
  await workflow.save()

  // Deactivate associated webhook
  const webhook = await Webhook.findOne({ workflowId: workflow._id })
  if (webhook) {
    webhook.active = false
    await webhook.save()
  }

  const result = workflow.toObject()
  if (webhook) {
    result.webhook = {
      id: webhook._id,
      token: webhook.token,
      active: webhook.active,
      lastTriggeredAt: webhook.lastTriggeredAt,
    }
  }

  return result
}

export const getWorkflowStatsService = async (userId) => {
  const [
    totalWorkflows,
    activeWorkflows,
    totalExecutions,
    successfulExecutions,
    failedExecutions,
    recentWorkflows,
    recentExecutions,
  ] = await Promise.all([
    Workflow.countDocuments({ userId }),
    Workflow.countDocuments({ userId, status: 'active' }),
    Execution.countDocuments({ userId }),
    Execution.countDocuments({ userId, status: 'success' }),
    Execution.countDocuments({ userId, status: 'failed' }),
    Workflow.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean(),
    Execution.find({ userId })
      .sort({ startedAt: -1 })
      .limit(5)
      .populate('workflowId', 'name')
      .lean(),
  ])

  // Attach webhook status to recent workflows
  const wfIds = recentWorkflows.map((w) => w._id)
  const webhooks = await Webhook.find({ workflowId: { $in: wfIds } }).lean()
  const whMap = new Map(webhooks.map((wh) => [wh.workflowId.toString(), wh]))

  const populatedRecentWorkflows = recentWorkflows.map((wf) => {
    const wh = whMap.get(wf._id.toString())
    return {
      ...wf,
      webhook: wh
        ? {
            id: wh._id,
            token: wh.token,
            active: wh.active,
            lastTriggeredAt: wh.lastTriggeredAt,
          }
        : null,
    }
  })

  return {
    metrics: {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
    },
    recentWorkflows: populatedRecentWorkflows,
    recentExecutions,
  }
}
