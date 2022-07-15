export default {
  type: "object",
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'string' },
    count: {type: 'number'}
  },
  required: ['id', 'title', 'price']
}
