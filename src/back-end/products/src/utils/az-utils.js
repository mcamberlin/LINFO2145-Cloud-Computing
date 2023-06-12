const { BlobServiceClient } = require("@azure/storage-blob");
const { v4 } = require('uuid')
const uuidv4 = v4;
// require the fs module for saving the image
const fs = require('fs');



const sas = process.env.AZURE_SAS || "?sp=racwdli&st=2022-11-23T12:13:22Z&se=2023-11-23T20:13:22Z&sv=2021-06-08&sr=c&sig=5Aybai7pC5ApwrHx1AS5at%2BS97hVsnR4z7KWS1aLXjQ%3D";
const account = process.env.AZURE_ACCOUNT || "ery4zproduct";

const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);


const containerName = process.env.AZURE_CONTAINER_NAME || `scapp-images`;
const containerClient = blobServiceClient.getContainerClient(containerName);

function uploadPicture(pictureB64, type) {
    return new Promise((resolve, reject) => {
        const blobName = `${uuidv4()}.${type}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // convert base64 to stream
        const stream = Buffer.from(pictureB64, 'base64');
        base64_decode(pictureB64, blobName).then(() => {

            const url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;

            const bufflen = Buffer.byteLength(stream);
            const uploadBlobResponse = blockBlobClient.uploadFile(`./${blobName}`).then((response) => {
                fs.unlink(`./${blobName}`, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
                resolve(url);
            }).catch((error) => {
                fs.unlink(`./${blobName}`, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
                reject(error);
            });
        });
    });
}

function base64_decode(base64Image, file) {
    return new Promise((resolve, reject) => {

        fs.writeFile(file, base64Image, { encoding: 'base64' }, function(err) {
            resolve();
        });

    });

}

module.exports = {
    uploadPicture
}