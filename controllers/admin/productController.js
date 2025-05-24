const Product = require('../../models/productSchema');

// [ADMIN] Créer un produit
exports.createProduct = async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        success: false,
        error: "Le nom et le prix sont obligatoires"
      });
    }

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description || "",
      images: req.body.images || [],
      stock: req.body.stock || 1,
      category: req.body.category || "autres"
    });

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// [ADMIN] Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// [ADMIN] Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// [PUBLIC/ADMIN] Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// [PUBLIC/ADMIN] Récupérer un produit spécifique
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};