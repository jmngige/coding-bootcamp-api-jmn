class ApiFilters {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

   

    filter(){
        
        const queryCopy = { ...this.queryStr }

        const removeFields = ['select', 'sort']

        removeFields.forEach(param => delete queryCopy[param])

        let rawQuery = JSON.stringify(queryCopy)
        
        rawQuery = rawQuery.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`)
        
        this.query = this.query.find(JSON.parse(rawQuery))

        return this
    }

    select(){
        if(this.queryStr.select){
            const selected = this.queryStr.select.split(',').join('')
            this.query = this.query.select(selected)
       
        }else {
            this.query = this.query.select()
        }

        return this
        }
    

    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('createdAt')
        }

        return this
    }

    pagination(){
        const page = parseInt(this.queryStr.page) || 1
        const limit = parseInt(this.queryStr.limit) || 10
        
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        //const total = this.query.countDocuments()

        this.query = this.query.skip(startIndex).limit(limit)

        //pagination
        // const paginations = {}

        // if(endIndex < total){
        //     paginations.next = {
        //         page:  page + 1,
        //         limit
        //     }
        // }

        // if(startIndex > 0){
        //     paginations.prev = {
        //         page: page - 1,
        //         limit
        //     }
        // }

        return this

    }
}

module.exports = ApiFilters