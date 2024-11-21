import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import UPDATE_CART from '../../graphql/updateCart.graphql';
import GET_PRODUCT from '../../graphql/getProductBySku.graphql';
import { useCssHandles } from "vtex.css-handles";
import './QuickOrder.css';

const CSS_HANDLES = [
  "quickOrderContainer",
  "quickOrderInputWrapper",
  "quickOrderInput",
  "quickOrderInputError",
  "quickOrderErrorMessage",
  "quickOrderButton",
  "quickOrderText",
  "quickOrderForm",
  "quickOrderTitle",
  "quickOrderDescription"
] as const;

const QuickOrder = () => {
  const handles = useCssHandles(CSS_HANDLES);
  const [getProductData, { data: product, called }] = useLazyQuery(GET_PRODUCT);
  const [addToCart] = useMutation(UPDATE_CART);
  const [inputText, setInputText] = useState("");
  const [notFound, setNotFound] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    // Limpia el mensaje de error al cambiar el texto
    if (notFound) setNotFound("");
  };

  const searchProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setNotFound("No ha ingresado un SKU.");
      return;
    }

    setIsLoading(true);
    getProductData({
      variables: { sku: inputText.trim() },
    });
  };

  const updateAddToCart = (productId: string) => {
    const skuId = parseInt(productId, 10);
    addToCart({
      variables: {
        salesChannel: "1",
        items: [
          {
            id: skuId,
            quantity: 1,
            seller: "1",
          },
        ],
      },
    }).then(() => {
      window.location.href = `/checkout`;
    });
  };

  useEffect(() => {
    if (!called) return; // Asegura que la consulta haya sido llamada
    setIsLoading(false);

    if (product?.product?.productId) {
      updateAddToCart(product.product.productId);
      setNotFound(""); // Limpia cualquier mensaje de error
    } else {
      setNotFound("No se encontró el SKU ingresado.");
    }
  }, [product, called]);

  return (
    <div className={handles.quickOrderContainer}>
      <div className={handles.quickOrderText}>
  <span className={handles.quickOrderTitle}>¡Haz tu pedido en un click!</span>
  <span className={handles.quickOrderDescription}>Solo ingresa el SKU del producto y consigue tu compra al instante. Disfruta de una experiencia rápida y sencilla.</span>
  </div>

      <form onSubmit={searchProduct} className={handles.quickOrderForm}>
        <div className={handles.quickOrderInputWrapper}>
          <input
            id="sku"
            type="text"
            value={inputText}
            placeholder="Ingrese el SKU"
            onChange={handleChange}
            className={`${handles.quickOrderInput} ${notFound ? handles.quickOrderInputError : ""}`}
            style={{
              borderColor: notFound ? "red" : "initial",
              borderWidth: notFound ? "0px" : "0px",
              color: notFound ? "red" : "initial",
            }}
          />
          {notFound && (
            <small className={handles.quickOrderErrorMessage}>
              {notFound}
            </small>
          )}
        </div>
        <input
          type="submit"
          value={isLoading ? "Cargando..." : "Agregar al carrito"}
          className={handles.quickOrderButton}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default QuickOrder;
