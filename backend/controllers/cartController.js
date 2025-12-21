import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.userId);
      
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {};
      
      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      } else {
         cartData[req.body.itemId] += 1;
      }
      
      await userModel.findByIdAndUpdate(req.userId, { cartData });
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ success: false, message: "Error adding to cart" });
   }
}

const removeFromCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.userId);
      
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {};
      
      if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
         
         if (cartData[req.body.itemId] === 0) {
            delete cartData[req.body.itemId];
         }
      }
      
      await userModel.findByIdAndUpdate(req.userId, { cartData });
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ success: false, message: "Error removing from cart" });
   }
}

const getCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.userId);
      
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {};
      res.json({ success: true, cartData });
   } catch (error) {
      console.error("Get cart error:", error);
      res.status(500).json({ success: false, message: "Error fetching cart" });
   }
}

export { addToCart, removeFromCart, getCart }