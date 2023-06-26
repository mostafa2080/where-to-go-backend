const express = require("express");
const controller = require("../controllers/customerController");
const validateCustomer = require("../utils/validators/customerValidator");
const { uploadImg } = require("../utils/imageUtility");

const {
  EmployeeOrAbove,
  CustomerOrAbove,
  authorize,
} = require("../middlewares/authorizationMiddleware");

const router = express.Router();

router.get(
  "/getMe",
  authorize(['getMe_customer']),
  controller.getLoggedCustomerData,
  controller.getCustomerById
);
router.get("/myFavorites", authorize(['get_myFavorites']), controller.getFavoritePlaces);
router.put(
  "/changeMyPassword",
  authorize(['edit_changeMyPassword_customer']),
  validateCustomer.changeUserPasswordValidator,
  controller.updateLoggedCustomerPassword
);
router.put(
  "/updateMe",
  authorize(['editMe_customer']),
  uploadImg().single("image"),
  controller.updateLoggedCustomerData
);
router.delete("/deleteMe", authorize(['deleteMe_customer']), controller.deleteLoggedCustomerData);

router
  .route("/")
  .get(authorize(['get_customers']), controller.getAllCustomers)
  .post(
    uploadImg().single("image"),
    validateCustomer.validatePostArray,
    controller.addCustomer
  );

router
  .route("/:id")
  .all(authorize(['get_customer']), validateCustomer.validateIdParam)  // all system users can do this route
  .get(controller.getCustomerById)
  .patch(
    uploadImg().single("image"),
    validateCustomer.validatePatchArray,
    controller.editCustomer
  )
  .delete(controller.deleteCustomer);

router
  .route("/softDelete/:id")
  .patch(
    authorize(['delete_customer']),
    validateCustomer.validateIdParam,
    controller.softDeleteCustomer
  );

router
  .route("/restore/:id")
  .patch(
    authorize(['restore_customer']),
    validateCustomer.validateIdParam,
    controller.restoreCustomer
  );

router
  .route("/deactivate/:id")
  .patch(
    authorize(['deactivate_customer']),
    validateCustomer.validateIdParam,
    controller.deactivateCustomer
  );

router
  .route("/activate/:id")
  .patch(
    authorize(['activate_customer']),
    validateCustomer.validateIdParam,
    controller.activateCustomer
  );

router
  .route("/ban/:id")
  .patch(
    authorize(['ban_customer']),
    validateCustomer.validateIdParam,
    controller.banCustomer
  );

router
  .route("/unban/:id")
  .patch(
    authorize(['unban_customer']),
    validateCustomer.validateIdParam,
    controller.unbanCustomer
  );

module.exports = router;
