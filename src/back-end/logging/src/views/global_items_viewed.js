const viewDescriptor = {
    views: {
        global_ItemViewed: {
            map: function(doc) {
                if (doc.eventType == "ItemViewed" && doc.eventData.itemId) {
                    emit(doc.eventData.itemId, 1)
                }
            },
            reduce: function(key, values) {
                return sum(values)
            }
        },
        global_CartCheckedOut: {
            map: function(doc) {
                if (doc.eventType == "CartCheckedOut" && doc.eventData.items) {
                    for (var itemIndex = 0; itemIndex < doc.eventData.items.length; itemIndex++) {
                        emit(doc.eventData.items[itemIndex].id, doc.eventData.items[itemIndex].quantity)
                    }
                }
            },
            reduce: function(key, values) {
                return sum(values)
            }
        },
        user_ItemViewed: {
            map: function(doc) {
                if (doc.eventType == "ItemViewed" && doc.eventData.itemId) {
                    var result = [
                        [doc.eventData.itemId, 1]
                    ];

                    emit(doc.username, result)
                }

            },
            reduce: function(keys, values) {
                return values.reduce(function(a, b) {
                    var localAggregate = a
                    for (var index = 0; index < b.length; index++) {
                        var itemId = b[index][0]
                        var count = b[index][1]

                        var found = false

                        for (var index2 = 0; index2 < localAggregate.length; index2++) {
                            if (itemId == localAggregate[index2][0]) {
                                localAggregate[index2][1] = localAggregate[index2][1] + count;
                                found = true
                                break;
                            }
                        }

                        if (!found) {
                            localAggregate.push([itemId, count])
                        }
                    }

                    return localAggregate;

                })


            }
        },
        user_ItemAddedToCart: {
            map: function(doc) {
                if (doc.eventType == "ItemAddedToCart" && doc.eventData.itemId) {
                    var result = [
                        [doc.eventData.itemId, doc.eventData.quantity]
                    ];

                    emit(doc.username, result)
                }

            },
            reduce: function(keys, values) {
                return values.reduce(function(a, b) {
                    var localAggregate = a
                    for (var index = 0; index < b.length; index++) {
                        var itemId = b[index][0]
                        var count = b[index][1]

                        var found = false

                        for (var index2 = 0; index2 < localAggregate.length; index2++) {
                            if (itemId == localAggregate[index2][0]) {
                                localAggregate[index2][1] = localAggregate[index2][1] + count;
                                found = true
                                break;
                            }
                        }

                        if (!found) {
                            localAggregate.push([itemId, count])
                        }
                    }

                    return localAggregate;

                })


            }
        },
        user_CartCheckedOut: {
            map: function(doc) {
                if (doc.eventType == "CartCheckedOut") {

                    var result = [];
                    for (var itemIndex = 0; itemIndex < doc.eventData.items.length; itemIndex++) {
                        result.push([doc.eventData.items[itemIndex].id, doc.eventData.items[itemIndex].quantity])
                    }

                    emit(doc.username, result)
                }

            },
            reduce: function(keys, values) {
                return values.reduce(function(a, b) {
                    var localAggregate = a
                    for (var index = 0; index < b.length; index++) {
                        var itemId = b[index][0]
                        var count = b[index][1]

                        var found = false

                        for (var index2 = 0; index2 < localAggregate.length; index2++) {
                            if (itemId == localAggregate[index2][0]) {
                                localAggregate[index2][1] = localAggregate[index2][1] + count;
                                found = true
                                break;
                            }
                        }

                        if (!found) {
                            localAggregate.push([itemId, count])
                        }
                    }

                    return localAggregate;

                })


            }
        }
    }
}
module.exports = { viewDescriptor }