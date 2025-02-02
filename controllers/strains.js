const User = require("../models/user");
const Strain = require("../models/strain");
const Mouse = require("../models/mouse");
const BreedingRecord = require("../models/breedingRecord");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  const strains = await Strain.find({});
  const strainsWithUsers = await Promise.all(
    strains.map(async (strain) => {
      const users = await User.find({ username: { $in: strain.users } });
      return {
        ...strain.toObject(), // 將 Mongoose 文件轉換為普通物件
        users, // 關聯的使用者資料
      };
    })
  );
  res.status(200).json({ strains: strainsWithUsers });
};

module.exports.createNewStrain = async (req, res) => {
  if (!req.body.strain) throw new ExpressError("無效的表單或不完整的表單", 400);
  const { strain } = req.body;
  const newStrain = new Strain({
    strain: strain.strain,
    abbr: strain.abbr,
    iacuc_no: strain.iacuc_no,
    dept: strain.dept,
    EXP: strain.EXP,
    genes: strain.genes,
  });
  if (strain.users && Array.isArray(strain.users)) {
    for (let username of strain.users) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new ExpressError(`使用者 ${username} 不存在`, 400);
      }
      newStrain.users.push(user.username);
    }
  }
  await newStrain.save();
  res.status(200).json({ message: "成功新增品系", redirect: "/strains/index" });
};

module.exports.showStrain = async (req, res) => {
  const { strainId } = req.params;
  const strain = await Strain.findById(strainId);
  const mice = await Mouse.find({ strain: strainId });
  const users = await User.find({ username: { $in: strain.users } });
  const breedingRecord = await BreedingRecord.find({ strain: strainId });
  res.status(200).json({ strain, mice, users, strainId, breedingRecord });
};

module.exports.renderEditForm = async (req, res) => {
  const strain = await Strain.findById(req.params.strainId).populate("users");
  const roles = ["計畫主持人", "學生", "研究助理", "品系管理人", "獸醫"];
  res.render("strains/edit", { strain, roles });
};

module.exports.updateStrain = async (req, res) => {
  const { strainId } = req.params;
  await Strain.findByIdAndUpdate(strainId, req.body.strain);
  const strain = await Strain.findById(strainId);
  await strain.save();
  res
    .status(200)
    .json({ message: "成功修改品系資訊", redirect: `/strains/${strainId}` });
};

module.exports.deleteStrain = async (req, res) => {
  const { strainId } = req.params;
  await Strain.findByIdAndDelete(strainId);
  res.status(200).json({ message: "成功刪除品系", redirect: "/strains/index" });
};
