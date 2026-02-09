import { Router } from "express";

const router = Router();

// Indian PIN code first 1-2 digits map to regions/speed
// Metro cities: 2-3 days | Urban: 3-5 days | Semi-urban: 5-7 days | Remote: 7-10 days
const metroPins = ["11", "40", "56", "60", "50", "38", "70", "30", "36", "22", "41", "32", "20", "12", "13", "14", "15"];
const urbanPins = ["10", "21", "23", "24", "25", "26", "28", "31", "33", "34", "35", "37", "39", "42", "43", "44", "45", "46", "48", "49", "51", "52", "53", "54", "55", "57", "58", "61", "62", "63", "64", "65", "67", "68", "69", "71", "72", "73", "74", "75", "76", "80", "81", "82", "83", "84", "85"];

function getDeliveryEstimate(pincode) {
  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return null;
  }

  const prefix = pincode.substring(0, 2);
  let minDays, maxDays, type;

  if (metroPins.includes(prefix)) {
    minDays = 2; maxDays = 3; type = "Metro City";
  } else if (urbanPins.includes(prefix)) {
    minDays = 3; maxDays = 5; type = "Urban";
  } else if (parseInt(prefix) >= 1 && parseInt(prefix) <= 85) {
    minDays = 5; maxDays = 7; type = "Semi-Urban";
  } else {
    minDays = 7; maxDays = 10; type = "Remote Area";
  }

  const today = new Date();
  const deliveryFrom = new Date(today);
  deliveryFrom.setDate(today.getDate() + minDays);
  const deliveryTo = new Date(today);
  deliveryTo.setDate(today.getDate() + maxDays);

  const formatDate = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  return {
    pincode,
    type,
    deliveryFrom: formatDate(deliveryFrom),
    deliveryTo: formatDate(deliveryTo),
    minDays,
    maxDays,
    freeDelivery: true,
    message: `Delivery between ${formatDate(deliveryFrom)} - ${formatDate(deliveryTo)}`,
  };
}

router.get("/estimate", (req, res) => {
  const { pincode } = req.query;
  const estimate = getDeliveryEstimate(pincode);
  if (!estimate) {
    return res.status(400).json({ error: "Please enter a valid 6-digit Indian PIN code" });
  }
  res.json(estimate);
});

export default router;
