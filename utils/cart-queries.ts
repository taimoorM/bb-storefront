export const getCart = async (cartId: string) => {
  const res = await fetch(`/api/storefront/carts/${cartId}`);
  return res.json();
};
