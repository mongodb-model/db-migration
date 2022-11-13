module.exports = (option = {}) => `'use strict';
/*
|--------------------------------------------------------------------------
| ${option.model} Model
|--------------------------------------------------------------------------
|
| ${option.model} extends the BaseModel (Model) class and thus has everything
| the BaseModel has.
|
|
*/
const Model = require('@afrosintech/model');

 class ${option.model} extends Model{

    constructor(dbOptions = {collection: '${option.collection}'},...options){
        super(dbOptions);
        options.forEach(option => {
            if(Object.keys(option).length > 0){
                Object.keys(option).forEach(key => {
                    if(!this[key]) this[key] = option[key];
                })
            }
        })
    }
 }

 module.exports = ${option.model};
`

