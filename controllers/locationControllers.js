exports.getLocation = (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(latitude);
  console.log(longitude);
  res.status(200).json({
    Message: "Success",
  });
};
