class NotReachablePathException extends Error {
    message = "This path is not reachable";
    name = "NotReachablePathException"
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
function forEachPreventingFreezing(arr, callback) {
    return new Promise(resolve => {
        let resolvedCounter = 0;
        arr.forEach((item, index) => {
            window.setTimeout(() => {
                callback(item, index);
                resolvedCounter++;
                if (resolvedCounter == item.length) {
                    resolve(arr);
                }
            }, index * 10)
        })
    })
}

export {NotReachablePathException, forEachPreventingFreezing}