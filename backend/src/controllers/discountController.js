// controllers/discountController.js
import prisma from "../config/prisma.js";

// Get all active discounts available for users
export const getAvailableDiscounts = async (req, res) => {
  try {
    const discounts = await prisma.discount.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: { gt: new Date() } },
          { expiresAt: null }
        ]
      },
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
        minAmount: true,
        maxAmount: true,
        description: true,
        expiresAt: true,
        singleUse: true,
        allowedTypes: true
      }
    });

    res.json(discounts);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    res.status(500).json({ error: "Failed to fetch available discounts" });
  }
};

// Validate discount code for a user
export const validateDiscount = async (req, res) => {
  try {
    const { code, amount, type } = req.body;
    const userId = req.user.uid;

    // Find user by firebaseUid
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find discount
    const discount = await prisma.discount.findFirst({
      where: {
        code: code.toUpperCase().trim(),
        isActive: true,
        OR: [
          { expiresAt: { gt: new Date() } },
          { expiresAt: null }
        ]
      }
    });

    if (!discount) {
      return res.status(404).json({ error: "Invalid discount code" });
    }

    // Check if discount has reached max usage
    if (discount.maxUsage && discount.usageCount >= discount.maxUsage) {
      return res.status(400).json({ error: "Discount code has expired" });
    }

    // Check if user has already used this discount (for single-use codes)
    if (discount.singleUse) {
      const existingUsage = await prisma.booking.findFirst({
        where: {
          userId: user.id,
          discountCode: discount.code,
          status: { in: ['CONFIRMED'] }
        }
      });

      if (existingUsage) {
        return res.status(400).json({ error: "You have already used this discount code" });
      }
    }

    // Check minimum amount requirement
    if (discount.minAmount && amount < discount.minAmount) {
      return res.status(400).json({ 
        error: `Minimum amount of ₹${discount.minAmount} required for this discount` 
      });
    }

    // Check session type restrictions
    if (discount.allowedTypes && discount.allowedTypes.length > 0) {
      if (!discount.allowedTypes.includes(type)) {
        return res.status(400).json({ 
          error: `This discount is not valid for ${type.toLowerCase()} sessions` 
        });
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === 'PERCENTAGE') {
      discountAmount = (amount * discount.value) / 100;
      
      // Apply maximum amount limit for percentage discounts
      if (discount.maxAmount && discountAmount > discount.maxAmount) {
        discountAmount = discount.maxAmount;
      }
    } else {
      discountAmount = discount.value;
    }

    // Ensure discount doesn't make amount negative
    const finalAmount = Math.max(0, amount - discountAmount);

    res.json({ 
      success: true,
      discount: {
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        discountAmount: Math.round(discountAmount),
        description: discount.description,
        expiresAt: discount.expiresAt,
        minAmount: discount.minAmount,
        maxAmount: discount.maxAmount
      },
      originalAmount: amount,
      finalAmount: Math.round(finalAmount)
    });

  } catch (error) {
    console.error("Error validating discount:", error);
    res.status(500).json({ error: "Failed to validate discount code" });
  }
};