'use strict';

/*
|--------------------------------------------------------------------------
| users Schema
|--------------------------------------------------------------------------
|
| Here we you may add more options (keys) to your schema.
| There is nothing new here: this is the exact same schema validation as the native mongodb schema validation.
| For more information on mongodb schema validation please visit https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/
|
|
*/

module.exports = {
    validator: {
       $jsonSchema: {
          bsonType: "object",
          title: "Users Object Validation",
          required: [],
          properties: {
             name: {
                bsonType: "string",
                description: "'name' must be a string and is required"
             },
             created_at: {
                bsonType: "date",
                description: "'created_at' must be a date"
             },
             updated_at: {
                bsonType: "date",
                description: "'updated_at' must be a date"
             },
          }
       }
    }
 };
