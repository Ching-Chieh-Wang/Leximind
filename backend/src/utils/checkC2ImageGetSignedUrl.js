const {generateSignedUrl} = require('../services/c2Service')
const isC2File = (image) => {
    return image.startsWith('C2');
};

const checkC2ImageGetSignedUrl = (image)=>{
    if(isC2File(image)){
        return generateSignedUrl(image)
    }
    return image;
}

module.exports = { checkC2ImageGetSignedUrl};