const modelItem = require("../../models/model_item");
const modelCategory = require("../../models/model_category");
const modelImage = require("../../models/model_image");

module.exports = {
  viewItems: async (req, res) => {
    try {
      const category = await modelCategory.find();
      const alertMsg = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { msg: alertMsg, status: alertStatus };
      const title = "Travleeday | Items";
      res.render("admin/items/view_items", { category, alert, title });
    } catch (error) {
      req.flash("alertMessage", `${error.msg}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, description } = req.body;
      if (req.files.length > 0) {
        const category = await modelCategory.findOne({ _id: categoryId });
        const addItem = {
          categoryId: category._id,
          title,
          price,
          city,
          description,
        };
        const item = await modelItem.create(addItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        // loop image multiple
        for (i = 0; i < req.files.length; i++) {
          const imageSave = await modelImage.create({
            imageUrl: `uploadMultiple/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMessage", "Success Add Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/items");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.msg}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
  },
};
