import {defineType} from "sanity";

export default defineType({
    name:'movie2',
    title:'Movie2',
    type:'document',
    fields:[
        {
            name:'title',
            type:'string',
        },
        {
            name:'poster_path',
            type:'string',
        },
        {
            name:'overview',
            type:'string',
        },
        {
            name:'original_language',
            type:'string',
        },
        {
            name: 'showtimes',
            title: 'Showtimes',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'date',
                        title: 'Date',
                        type: 'date'
                    },
                    {
                        name: 'times',
                        title: 'Times',
                        type: 'array',
                        of: [{type: 'string'}]  // Assuming time as string, e.g., "18:30", "21:00"
                    }
                ]
            }]
        }
    ]
})
