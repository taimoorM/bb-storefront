export const addItem = async (
  variantId: string | undefined
): Promise<String | undefined> => {
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set("cartId", cartId);
  }

  if (!variantId) {
    return "Missing product variant ID";
  }

  try {
    await addToCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
  } catch (e) {
    return "Error adding item to cart";
  }
};
