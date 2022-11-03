const Product = require("../models/product")

const getAllProducts = async(req, res) => {

    const  {featured, name, company, sort, fields, numericFilters } = req.query;
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === "true" ? true: false;
    }

    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }

    if(company){
        queryObject.company = company;
    }

    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result = result.sort('createAt')
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    result = result.skip(skip).limit(limit)

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
            const regEx = /\b(<|>|>=|=|<|<=)\b/g;
            let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
            );
            const options = ['price', 'rating'];
            filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
            });
    }

    result = result.find(queryObject)
    const products = await result
    res.status(200).json({products, nbits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}