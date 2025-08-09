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
