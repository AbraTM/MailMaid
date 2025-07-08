const errorHandlerMiddlewar = (req, res, err, next) => {
    console.log(err);
    res.json({msg : "Something went wrong, please try again later"})
}