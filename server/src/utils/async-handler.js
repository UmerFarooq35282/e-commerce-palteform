const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // console.log("next: " ,typeof next);

        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            console.error(error);
            console.error(error.stack);
            next(error)
        });
    };
};

export default asyncHandler;