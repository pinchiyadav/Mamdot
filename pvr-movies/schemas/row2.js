import {defineType} from 'sanity'

export default defineType({
  name: 'row2',
  title: 'Row2',
  type: 'object',

  fields: [
    {
      name: 'row2',
      type: 'string',
    },
    {
      name: 'seats',
      type: 'array',
      of: [
        {
          name: 'seat',
          type: 'object',
          fields: [
            {
              name: 'number',
              type: 'string',
            },
      
          ],
        },
      ],
      options: {
        layout: 'table',
      },
    },
  ],
})
