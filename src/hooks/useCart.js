import { useEffect, useState } from "react";

export default function useCart() {

  const [cart, setCart] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "cart"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  // SAVE
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  // ============================
  // ADD
  // ============================

  const addToCart =
    (product) => {

      const existing =
        cart.find(
          (item) =>

            item.id === product.id &&

            item.selectedSize ===
              product.selectedSize &&

            item.selectedColor ===
              product.selectedColor
        );

      if (existing) {

        const updated =
          cart.map((item) =>

            item.id === product.id &&
            item.selectedSize ===
              product.selectedSize &&
            item.selectedColor ===
              product.selectedColor

              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }

              : item
          );

        setCart(updated);

      } else {

        setCart([
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ]);
      }
    };

  // ============================
  // REMOVE
  // ============================

  const removeFromCart =
    (index) => {

      const updated =
        [...cart];

      updated.splice(index, 1);

      setCart(updated);
    };

  // ============================
  // QUANTITY
  // ============================

  const increaseQty =
    (index) => {

      const updated =
        [...cart];

      updated[index].quantity++;

      setCart(updated);
    };

  const decreaseQty =
    (index) => {

      const updated =
        [...cart];

      if (
        updated[index]
          .quantity > 1
      ) {

        updated[index]
          .quantity--;

      } else {

        updated.splice(
          index,
          1
        );
      }

      setCart(updated);
    };

  // ============================
  // TOTAL
  // ============================

  const total =
    cart.reduce(
      (acc, item) =>

        acc +
        item.price *
          item.quantity,

      0
    );

  return {

    cart,
    setCart,

    addToCart,

    removeFromCart,

    increaseQty,
    decreaseQty,

    total,
  };
}