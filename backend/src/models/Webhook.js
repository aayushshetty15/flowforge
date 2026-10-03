import mongoose from 'mongoose'
import crypto from 'crypto'

const webhookSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: [true, 'Webhook must belong to a workflow'],
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(24).toString('hex'),
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastTriggeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Webhook = mongoose.model('Webhook', webhookSchema)

export default Webhook
