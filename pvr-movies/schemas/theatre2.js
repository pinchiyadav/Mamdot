import {defineType} from "sanity";


export default defineType({
    name:"theatre2",
    title:"Theatre2",
    type:'document',
    fields:[
        {
            name:'name',
            title:'Name',
            type:'string'
        },
        {
            title:"Location",
            name:"location",
            type:'reference',
            to:[{type:'location'}]
        },
        {
            title:"Row2",
            name:"row2",
            type:"array",
            of:[{type:"row2"}]
        }

    ]
})