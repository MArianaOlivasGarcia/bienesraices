

// Archivo con las asociaciones

import Property from "./property.model.js";
import Price from "./price.model.js";
import Category from "./category.model.js";
import User from "./user.model.js";
import Message from "./message.model.js";

// una propiedad tiene un precio
// Price.hasOne(Property) ó
Property.belongsTo(Price)
Property.belongsTo(Category)
Property.belongsTo(User)

Property.hasMany(Message)

Message.belongsTo(User);
Message.belongsTo(Property);

export {
    Property,
    Price,
    Category,
    User,
    Message
}