import mongoose from 'mongoose'

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a workflow name'],
      trim: true,
      maxLength: [100, 'Workflow name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxLength: [500, 'Description cannot exceed 500 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Workflow must belong to a user'],
      index: true,
    },
    nodes: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    edges: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive'],
      default: 'draft',
      index: true,
    },
    webhookEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Workflow = mongoose.model('Workflow', workflowSchema)

export default Workflow
