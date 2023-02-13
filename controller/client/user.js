const User = require("../../model/User");

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.body.id;
        const user = User.findById(userId).select("-password");
        res.send(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({
          status: "Fail",
          message: "Internal Server Occurred.",
        });
    }
}