import mongoose from 'mongoose'

const executionLogSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: true,
    },
    nodeType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'success', 'failed'],
      default: 'pending',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
)

const executionSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: [true, 'Execution must belong to a workflow'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Execution must belong to a user'],
      index: true,
    },
    status: {
      type: String,
      enum: ['running', 'success', 'failed'],
      default: 'running',
      index: true,
    },
    triggerData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    logs: [executionLogSchema],
  },
  {
    timestamps: true,
  }
)

const Execution = mongoose.model('Execution', executionSchema)

export default Execution
