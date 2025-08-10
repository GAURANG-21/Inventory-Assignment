import prisma from "../config/db.js";

export const addAProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const { name, type, sku, image_url, description, quantity, price } =
      req.body;

    const newProduct = await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: { sku },
      });

      if (existingProduct) {
        throw new Error("SKU already exists");
      }

      return tx.product.create({
        data: {
          name,
          type,
          sku,
          image_url,
          description,
          quantity,
          price,
          userId,
        },
      });
    });

    return res.status(201).json({
      product_id: newProduct.id,
      name: newProduct.name,
      type: newProduct.type,
      sku: newProduct.sku,
      image_url: newProduct.image_url,
      description: newProduct.description,
      quantity: newProduct.quantity,
      price: newProduct.price,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return res.status(500).json({
      message: "Server error while adding product",
      error: error.message,
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const { quantity } = req.body;
    if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a non-negative integer" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.userId !== userId) {
      return res.status(403).json({
        message: "Access denied. You can only update your own products.",
      });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { quantity },
    });

    return res.json({ message: "Product quantity updated successfully" });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;

    // Validation & sanitization
    page = Math.max(1, page);
    limit = Math.min(5, Math.max(1, limit));

    const skip = (page - 1) * limit;

    const totalCount = await prisma.product.count();

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        type: true,
        sku: true,
        image_url: true,
        description: true,
        quantity: true,
        price: true,
      },
      orderBy: { id: "asc" },
    });

    const formattedProducts = products.map((p) => ({
      product_id: p.id.toString(),
      name: p.name,
      type: p.type,
      sku: p.sku,
      image_url: p.image_url,
      description: p.description,
      quantity: p.quantity,
      price: p.price,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      totalCount,
      page,
      totalPages,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
