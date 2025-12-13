import { Router } from "express";
import auth from "../../middleware/auth.js";
import { role } from "../../utils/role.js";
import { bookingController } from "./booking.controller.js";

const router = Router();

router.post(
  "/",
  auth(role.admin, role.customer),
  bookingController.createBooking
);

router.get(
  "/",
  auth(role.admin, role.customer),
  bookingController.getAllBooking
);

router.put(
  "/:id",
  auth(role.admin, role.customer),
  bookingController.updateBooking
);

router.put(
  "/auto-return",
  auth(role.admin),
  bookingController.autoReturnBooking
);

export const bookingRouter = router;
