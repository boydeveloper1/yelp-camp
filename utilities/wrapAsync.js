// Error handling fnction - For unforseen issues - try and catch

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}