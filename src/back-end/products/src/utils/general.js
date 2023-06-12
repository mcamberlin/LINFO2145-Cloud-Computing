function verifyProduct(product) {
    // This function is used to verify the validity of the product
    // parameter. It returns the error code 400 if the product is
    // invalid.

    // Check if the product.name is a valid string
    const nameRes = verifyName(product.name)
    if (!nameRes.valid) {
        return nameRes
    }

    // Check if the product.price is a valid float
    const priceRes = verifyPrice(product.price)
    if (!priceRes.valid) {
        return priceRes
    }

    // Check if the product.category is a valid string
    const categoryRes = verifyCategory(product.category)
    if (!categoryRes.valid) {
        return categoryRes
    }

    // Check if the product.quantity is a valid integer
    const quantityRes = verifyQuantity(product.quantity)
    if (!quantityRes.valid) {
        return quantityRes
    }


    // Check if the product.image is a valid base64 file
    const imageRes = verifyImage(product.image)
    if (!imageRes.valid) {
        return imageRes
    }

    return { valid: true };
}

function verify(key, value) {
    if (key === "name") {
        return verifyName(value);
    }
    if (key === "price") {
        return verifyPrice(value);
    }
    if (key === "category") {
        return verifyCategory(value);
    }
    if (key === "quantity") {
        return verifyQuantity(value);
    }
    if (key === "image") {
        return verifyImage(value);
    }
}

function verifyName(name) {
    if (name === undefined || name === null) {
        return { valid: false, reason: "name is undefined or null" };
    }
    if (name === "" || typeof name !== "string") {
        return { valid: false, reason: "name is not a valid string" };
    }
    return { valid: true }
}

function verifyPrice(price) {
    if (price === undefined || price === null || price === "") {
        return { valid: false, reason: "price is undefined or null" };
    }
    if (typeof price !== "number" || price <= 0) {
        var type = typeof price
        return { valid: false, reason: `price is not a valid number: ${type}` };
    }
    return { valid: true }
}

function verifyCategory(category) {
    if (category === undefined || category === null) {
        return { valid: false, reason: `category is undefined or null` };
    }
    if (category === "" || typeof category !== "string") {
        return { valid: false, reason: "category is not a valid string" };
    }
    return { valid: true }
}

function verifyQuantity(quantity) {
    if (quantity === undefined || quantity === null) {
        return { valid: false, reason: "quantity is undefined or null" };
    }
    if (typeof quantity !== "number" || Number.isInteger(quantity) === false || quantity < 0) {
        return { valid: false, reason: `quantity is not a valid integer` };
    }
    return { valid: true }
}

function verifyImage(image) {

    if (image === undefined || image === null) {
        return { valid: false, reason: "image is undefined or null" }
    }

    const format = image.split(';')[0].split('/')[1]
    if (format !== "jpeg" && format !== "png" && format !== "gif" && format !== "jpg") {
        return { valid: false, reason: `image is not a valid format` };
    }

    const base64data = image.split(',')[1]


    if (!isBase64(base64data)) {
        return { valid: false, reason: "image is not a valid base64 file" }
    }
    return { valid: true }

}

function isBase64(str) {
    if (str === '' || str.trim() === '') { return false; }
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}


module.exports = {
    verifyProduct,
    verify,
    verifyName,
    verifyPrice,
    verifyCategory,
    verifyQuantity,
    verifyImage
}